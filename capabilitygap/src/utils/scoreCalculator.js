import { supabase } from '../supabase';

/**
 * Calculates capability scores for a user based on their assessment attempts
 * and securely upserts the results into the `capability_scores` table.
 * 
 * @param {string} userId - The standard UUID of the authenticated user
 * @param {number} expectedTimePerQuestion - Baseline expected time per question in seconds (defaults to 60)
 */
export const calculateCapabilityScores = async (userId, expectedTimePerQuestion = 60) => {
  if (!userId) {
    console.error("Missing userId for capability calculation");
    return { success: false, message: "Missing User ID" };
  }

  try {
    // 1. Fetch all attempts for this user and map manually without relying on SQL explicit references preventing 400 Bad Requests
    const { data: rawAttempts, error: fetchError } = await supabase
      .from('attempts')
      .select('id, correct, time_taken, confidence_rating, question_id')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    const { data: allQuestions } = await supabase.from('questions').select('id, skill_id');

    const attempts = rawAttempts || [];
    if (allQuestions?.length > 0) {
      attempts.forEach(a => {
        const match = allQuestions.find(q => q.id === a.question_id);
        if (match) a.questions = { skill_id: match.skill_id };
      });
    }
    if (!attempts || attempts.length === 0) {
      return { success: true, message: "No attempts found to process." };
    }

    // 2. Group attempts by skill_id
    const skillData = {};

    attempts.forEach(attempt => {
      const skillId = attempt.questions?.skill_id;
      if (!skillId) return; // Skip if data is corrupted

      if (!skillData[skillId]) {
        skillData[skillId] = {
          totalQuestions: 0,
          correctAnswers: 0,
          totalTimeTaken: 0,
          totalConfidence: 0
        };
      }

      skillData[skillId].totalQuestions += 1;
      skillData[skillId].totalTimeTaken += Number(attempt.time_taken || 0);
      skillData[skillId].totalConfidence += Number(attempt.confidence_rating || 0);
      if (attempt.correct) {
        skillData[skillId].correctAnswers += 1;
      }
    });

    // 3. Process the algorithms per skill and prepare upsert payload
    const upsertPayload = [];

    for (const [skillId, metrics] of Object.entries(skillData)) {
      // Knowledge Score: (correct / total questions) - Normalizes to 0-1
      const knowledgeScore = metrics.correctAnswers / metrics.totalQuestions;

      // Speed Score: Expected Time / Actual Time
      const totalExpectedTime = metrics.totalQuestions * expectedTimePerQuestion;
      // Cap the speed score to 1.0 to prevent hyper-rushing from artificially inflating overall capability score
      let speedScore = totalExpectedTime / (metrics.totalTimeTaken || 1); 
      if (speedScore > 1) speedScore = 1; 

      // Confidence Score: Average Confidence / 5 
      const avgConfidence = metrics.totalConfidence / metrics.totalQuestions;
      const confidenceScore = avgConfidence / 5;

      // Final Capability Score
      // Weights: 50% Knowledge, 30% Speed, 20% Confidence
      const capabilityScore = (0.5 * knowledgeScore) + (0.3 * speedScore) + (0.2 * confidenceScore);

      // We strictly scale them arbitrarily to percentages (0-100) before saving logic if preferred,
      // but keeping them decimal / ratio-based is better standard. 
      // Multiplied by 100 for storage to make dashboards easier (scale 0-100)
      upsertPayload.push({
        user_id: userId,
        skill_id: skillId,
        knowledge_score: Math.round(knowledgeScore * 100 * 100) / 100,
        speed_score: Math.round(speedScore * 100 * 100) / 100,
        confidence_score: Math.round(confidenceScore * 100 * 100) / 100,
        capability_score: Math.round(capabilityScore * 100 * 100) / 100,
        // The updated_at trigger defined in Supabase schema will automatically update timestamp
      });
    }

    // 4. Safely purge old scores and insert new ones to bypass missing ON CONFLICT SQL constraints natively
    await supabase.from('capability_scores').delete().eq('user_id', userId);
    
    const { error: insertError } = await supabase
      .from('capability_scores')
      .insert(upsertPayload);

    if (insertError) throw insertError;

    return { success: true, data: upsertPayload, message: "Capability scores generated successfully." };

  } catch (error) {
    console.error("Error calculating capability scores:", error);
    return { success: false, message: error.message };
  }
};
