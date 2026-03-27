import { supabase } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Dynamically generates Assessment Structures utilizing Gemini AI!
 * If a role doesn't exist natively, this engine calls Google Gemini to invent 
 * core skills, thresholds, and multiple-choice questions natively mapped to your SQL architecture!
 */
export const generateRoleAssessment = async (roleName) => {
  if (!roleName) return { success: false, message: 'Missing target role.' };

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing! Cannot dynamically generate questions.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are an expert strict EdTech assessment architect. 
    A student wants to evaluate themselves for the role: "${roleName}".
    
    1. Identify exactly 5 highly relevant technical/soft skills absolutely critical for this role.
    2. For EACH skill, generate exactly 3 challenging multiple-choice questions (one 'Basic', one 'Medium', one 'Hard'). You must produce EXACTLY 15 questions total (5 skills x 3 difficulty tiers).
    3. Generate 4 highly plausible multiple choice 'options' for every question.
    4. Provide an expected required baseline score (e.g., 70, 80, 85) out of 100 for a junior/mid candidate on that specific skill.
    
    Return your response strictly as a JSON array EXACTLY matching this structural footprint without markdown wrappers:
    [
      {
        "skill_name": "React Optimization",
        "required_score": 85,
        "difficulty": "Medium",
        "question": "Which hook intrinsically prevents unnecessary computational executions across renders?",
        "options": ["useEffect", "useMemo", "useState", "useRef"],
        "correct_option": "useMemo"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    let text = await result.response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsedAI = JSON.parse(text);

    // 1. Insert these new skills gracefully! deduplicate names globally
    const uniqueSkillsMap = new Map();
    parsedAI.forEach(s => {
       if(!uniqueSkillsMap.has(s.skill_name)) uniqueSkillsMap.set(s.skill_name, s);
    });
    
    const newSkills = Array.from(uniqueSkillsMap.values()).map(s => ({ skill_name: s.skill_name }));
    const { data: insertedSkills, error: skillsError } = await supabase
      .from('skills')
      .insert(newSkills)
      .select();

    if (skillsError) throw skillsError;

    // 2. Map inserted skills to their correct questions and Role Requirements
    const roleReqsToInsert = [];
    const questionsToInsert = [];

    parsedAI.forEach((aiNode) => {
      // Find the corresponding inserted skill ID mapping safely
      const matchedSkillRecord = insertedSkills.find(sk => sk.skill_name === aiNode.skill_name);
      if (!matchedSkillRecord) return;
      const matchedSkillId = matchedSkillRecord.id;
      
      // Ensure we only insert one requirement limit per skill safely
      if (!roleReqsToInsert.find(r => r.skill_id === matchedSkillId)) {
          roleReqsToInsert.push({
            role_name: roleName,
            skill_id: matchedSkillId,
            required_score: aiNode.required_score
          });
      }

      questionsToInsert.push({
        skill_id: matchedSkillId,
        // We gracefully package the raw AI strings natively into a parseable payload for Assessment.jsx mapping constraints
        question: JSON.stringify({
           text: aiNode.question,
           options: aiNode.options || ['Option A', 'Option B', 'Option C', 'Option D'],
           difficulty: aiNode.difficulty
        }),
        correct_option: aiNode.correct_option,
        // Bind explicit difficulty timings matching tiers natively tracking 45, 60, or 90 benchmark bounds
        expected_time: aiNode.difficulty === 'Hard' ? 90 : (aiNode.difficulty === 'Medium' ? 60 : 45) 
      });
    });

    // 3. Inject Role Requirements universally
    const { error: reqError } = await supabase.from('role_requirements').insert(roleReqsToInsert);
    if (reqError) throw reqError;

    // 4. Inject Dynamic Questions
    const { error: qError } = await supabase.from('questions').insert(questionsToInsert);
    if (qError) throw qError;

    return { success: true };

  } catch (error) {
    console.error("Failed to generate dynamic AI assessment:", error);
    return { success: false, error: error.message };
  }
};
