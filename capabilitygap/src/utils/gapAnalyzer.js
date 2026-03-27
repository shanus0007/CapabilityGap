import { supabase } from '../supabase';
import { generateRecommendations } from './recommendationEngine';

/**
 * Compares the user's capability scores against the requirements for a specific role.
 * Calculates the gaps, stores them in `skill_gaps`, and returns classifications.
 * 
 * @param {string} userId - The standard UUID of the authenticated user
 * @param {string} roleName - The target role name exactly as it appears in `role_requirements`
 */
export const analyzeSkillGaps = async (userId, roleName) => {
  if (!userId || !roleName) {
    return { success: false, message: "Missing User ID or Target Role" };
  }

  try {
    // 1. Fetch the Required Scores for the specified Role mapped manually bypassing foreign key crash
    const { data: rawReqs, error: reqError } = await supabase
      .from('role_requirements')
      .select('skill_id, required_score')
      .eq('role_name', roleName);

    if (reqError) throw reqError;

    const { data: allSkills } = await supabase.from('skills').select('id, skill_name');
    
    const requirements = rawReqs || [];
    if (allSkills?.length > 0) {
        requirements.forEach(r => {
            const match = allSkills.find(s => s.id === r.skill_id);
            if (match) r.skills = { name: match.skill_name };
        });
    }
    if (!requirements || requirements.length === 0) {
      return { success: false, message: `No role requirements found for role: ${roleName}` };
    }

    // 2. Fetch the User's current Capability Scores
    const { data: userScores, error: scoreError } = await supabase
      .from('capability_scores')
      .select('skill_id, capability_score')
      .eq('user_id', userId);

    if (scoreError) throw scoreError;

    // Create a fast lookup map for the user's current scores
    const scoreMap = {};
    if (userScores) {
      userScores.forEach(score => {
        scoreMap[score.skill_id] = score.capability_score;
      });
    }

    const upsertPayload = [];
    const resultingAnalysis = [];

    // 3. Process each required skill against the user's current capabilities
    for (const req of requirements) {
      const skillId = req.skill_id;
      // If user hasn't completed assessment for a skill, assume score is 0
      const currentScore = scoreMap[skillId] || 0; 
      const requiredScore = Number(req.required_score);
      
      // Gap calculation: Required - Current
      // If current score is >= required, gap is 0 (or negative, which we can clamp to 0)
      let gapScore = requiredScore - currentScore;
      if (gapScore < 0) gapScore = 0; 
      
      // Ensure we keep precision tidy
      gapScore = Math.round(gapScore * 100) / 100;

      // 4. Classify the Gap
      let classification = "None"; // Exceeds or meets requirements
      if (gapScore > 0) {
        // Assuming scores are scaled out of 100. Adjust these thresholds as needed for your model.
        if (gapScore <= 15) {
          classification = "Low";
        } else if (gapScore <= 40) {
          classification = "Medium";
        } else {
          classification = "High";
        }
      }

      // Payload strictly matches the `skill_gaps` table schema
      upsertPayload.push({
        user_id: userId,
        skill_id: skillId,
        current_score: currentScore,
        required_score: requiredScore,
        gap_score: gapScore
      });

      // UI Return array including the rich classification + skill names which aren't in the DB payload
      resultingAnalysis.push({
        skill_id: skillId,
        skill_name: req.skills?.name || 'Unknown Skill',
        current_score: currentScore,
        required_score: requiredScore,
        gap_score: gapScore,
        classification: classification
      });
    }

    // 5. Safely bypass missing strict SQL unique constraints by purging old gaps natively before insert
    await supabase.from('skill_gaps').delete().eq('user_id', userId);
    
    const { error: insertError } = await supabase
      .from('skill_gaps')
      .insert(upsertPayload);

    if (insertError) throw insertError;

    // Generates, purges old, and intelligently provisions new Action roadmaps instantly!
    await generateRecommendations(userId);

    return { 
      success: true, 
      data: resultingAnalysis, 
      message: "Gap analysis completed and saved successfully." 
    };

  } catch (error) {
    console.error("Error running gap analysis:", error);
    return { success: false, message: error.message };
  }
};
