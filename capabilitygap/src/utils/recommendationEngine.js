import { supabase } from '../supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateRecommendations = async (userId) => {
  if (!userId) return { success: false, message: 'Missing User ID' };

  try {
    const { data: rawGaps, error: fetchError } = await supabase
      .from('skill_gaps')
      .select('skill_id, gap_score, current_score, required_score')
      .eq('user_id', userId)
      .gt('gap_score', 0);

    if (fetchError) throw fetchError;
    
    const { data: allSkills } = await supabase.from('skills').select('id, skill_name');
    const gapData = rawGaps || [];
    
    if (allSkills?.length > 0) {
       gapData.forEach(g => {
           const match = allSkills.find(s => s.id === g.skill_id);
           if(match) g.skills = { name: match.skill_name };
       });
    }
    if (!gapData || gapData.length === 0) return { success: true, message: 'No active gaps.' };

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || 'unauthorized_key_fallback');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an AI learning advisor.
    Based on the student's skill gaps, generate a 2-week study plan.

    Gap Data:
    ${JSON.stringify(gapData)}

    Return strictly a JSON object exactly matching this format with no markdown wrappers:
    {
      "weekly_plan": "A concise overview of the 2-week focus areas.",
      "recommended_topics": "Key concepts they need to study.",
      "practice_tasks": "Specific actionable tasks or problems to solve.",
      "advice": "General learning advice to stay motivated."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Cleanse structural JSON wrappers
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const parsedPlan = JSON.parse(text);

    // Clear previous recommendations for this user
    const { error: delError } = await supabase
      .from('recommendations')
      .delete()
      .eq('user_id', userId);

    if (delError) throw delError;

    // Insert new explicit mapped blueprint
    const { error: insertError } = await supabase
      .from('recommendations')
      .insert([{
        user_id: userId,
        weekly_plan: parsedPlan.weekly_plan || "Detailed study plan.",
        topics: parsedPlan.recommended_topics || "Core learning topics.",
        tasks: parsedPlan.practice_tasks || "Recommended practice tasks.",
        advice: parsedPlan.advice || "Continue pushing forward steadily!"
      }]);

    if (insertError) throw insertError;
    
    return { success: true };

  } catch (error) {
    console.error("Error generating recommendations via Gemini API:", error);
    return { success: false, error: error.message };
  }
};
