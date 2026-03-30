import { supabase } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Ensures we have required skills for the role. If not, asks Gemini.
 */
export async function getOrGenerateSkillsForRole(roleName) {
  const { data: existingReqs } = await supabase
    .from('role_requirements')
    .select('skill_id')
    .ilike('role_name', roleName);

  if (existingReqs && existingReqs.length > 0) {
    const skillIds = existingReqs.map(r => r.skill_id);
    const { data: skills } = await supabase.from('skills').select('id, skill_name').in('id', skillIds);
    return skills.map(s => s.skill_name);
  }

  // Not found in DB, we must generate via Gemini
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `Identify exactly 5 highly relevant technical/soft skills absolutely critical for the role: "${roleName}". Return only a JSON array of strings. Example: ["React", "CSS", "TypeScript", "Node.js", "System Design"]`;

  const result = await model.generateContent(prompt);
  let text = result.response.text();
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const newSkillNames = JSON.parse(text);

  // Insert into DB
  const skillsToInsert = newSkillNames.map(name => ({ skill_name: name }));
  const { data: insertedSkills, error } = await supabase.from('skills').insert(skillsToInsert).select();
  if (error && error.code !== '23505') throw error; 

  const finalSkills = insertedSkills || [];
  
  if (finalSkills.length > 0) {
    const { data: duplicateSkills } = await supabase.from('skills').select('*').in('skill_name', newSkillNames);
    const allKnownSkills = duplicateSkills || finalSkills;
    
    const roleReqsToInsert = allKnownSkills.map(sk => ({
      role_name: roleName,
      skill_id: sk.id,
      required_score: 80 // Default benchmark
    }));
    await supabase.from('role_requirements').insert(roleReqsToInsert);
    return allKnownSkills.map(s => s.skill_name);
  }

  // Fallback to fetch if insertion had unique constraints conflicts
  const { data: existingSkills } = await supabase.from('skills').select('*').in('skill_name', newSkillNames);
  if (existingSkills?.length) {
     const roleReqs = existingSkills.map(sk => ({ role_name: roleName, skill_id: sk.id, required_score: 80 }));
     await supabase.from('role_requirements').insert(roleReqs);
     return existingSkills.map(s => s.skill_name);
  }

  return newSkillNames; // Fallback gracefully string only
}

export const generateAssessmentSession = async (userId, roleName) => {
  if (!roleName) return { success: false, message: 'Missing target role.' };
  if (!userId) userId = '00000000-0000-0000-0000-000000000000'; // fallback anonymous

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing!");

    // 1. Fetch required skills natively or via Gemini
    const requiredSkills = await getOrGenerateSkillsForRole(roleName);

    // 2. Fetch user's previous performance mapping to determine weak skills
    const { data: gapData } = await supabase.from('skill_gaps').select('skill_id, gap_score, current_score').eq('user_id', userId);
    
    // We map skill names to their gap/score to build the adaptive context
    // High Gap = Poor performance, Low Gap = Good performance
    const { data: userSkillsMetadata } = await supabase.from('skills').select('id, skill_name');
    
    // 3. Determine Adaptive Difficulty Distribution Per Skill
    const skillProfiles = requiredSkills.map(skillName => {
       const mappedDbSkill = userSkillsMetadata?.find(s => s.skill_name === skillName);
       const userGap = mappedDbSkill ? gapData?.find(g => g.skill_id === mappedDbSkill.id) : null;
       
       let difficultyRequest = "1 Easy, 1 Medium, 1 Hard (Default Distribution)";
       if (userGap && userGap.gap_score > 30) {
          // Poor performance mapping: 2 Easy, 1 Medium
          difficultyRequest = "2 Easy, 1 Medium, 0 Hard (Adaptive: Focus on foundational concepts)";
       } else if (userGap && userGap.gap_score <= 15) {
          // Excellent performance mapping: 1 Medium, 2 Hard
          difficultyRequest = "0 Easy, 1 Medium, 2 Hard (Adaptive: Focus on advanced concepts)";
       } else if (userGap) {
          // Average performance mapping
          difficultyRequest = "0 Easy, 2 Medium, 1 Hard (Adaptive: Standard progression)";
       }
       return { name: skillName, difficultyRequest };
    });

    // 4. Fetch previously asked questions to avoid repetition
    let previouslyAsked = [];
    const { data: pastSessions } = await supabase.from('assessment_sessions').select('id').eq('user_id', userId);
    if (pastSessions && pastSessions.length > 0) {
       const sessionIds = pastSessions.map(s => s.id);
       const { data: pastQLinks } = await supabase.from('session_questions').select('question_id').in('session_id', sessionIds);
       
       if (pastQLinks && pastQLinks.length > 0) {
           const pastQIds = pastQLinks.map(l => l.question_id);
           const { data: pastQs } = await supabase.from('questions_bank').select('question').in('id', pastQIds);
           previouslyAsked = pastQs ? pastQs.map(q => q.question) : [];
       }
    }

    const previousQContext = previouslyAsked.length > 0 
      ? `The user has already been asked these questions before. DO NOT REPEAT THEM: \n${previouslyAsked.slice(-30).map(q=>`- ${q}`).join('\n')}` 
      : "The user has not taken any questions yet.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert EdTech assessment architect generating a custom dynamic assessment for a user targeting the role: "${roleName}".

REQUIRED SKILLS AND ADAPTIVE DIFFICULTY INSTRUCTIONS:
${skillProfiles.map(s => `Skill: ${s.name} | Distribution required: ${s.difficultyRequest}`).join('\n')}

GLOBAL DISTRIBUTION RULE:
The total output MUST contain exactly 15 questions. Ensure the overall breakdown roughly matches: 30% Easy, 50% Medium, 20% Hard unless heavily skewed by adaptive instructions.

PREVIOUS QUESTION CONSTRAINTS:
${previousQContext}

Generate EXACTLY 15 unique, challenging multiple-choice questions. 
For EACH question, you must provide 4 distinct plausible options (option_a, option_b, option_c, option_d).
Expected time benchmark should be approx: Easy=45s, Medium=60s, Hard=90s.

Return your response strictly as a JSON array EXACTLY matching this structural footprint without markdown wrappers:
[
  {
    "role": "${roleName}",
    "skill": "React",
    "difficulty": "Medium",
    "question": "Which hook intrinsically prevents unnecessary computational executions across renders?",
    "option_a": "useEffect",
    "option_b": "useMemo",
    "option_c": "useState",
    "option_d": "useRef",
    "correct_option": "useMemo",
    "expected_time": 60
  }
]
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    const generatedQuestions = JSON.parse(text);

    // 5. Store new questions in questions_bank
    // The keys currently perfectly match the SQL schema defined
    const insertPayload = generatedQuestions.map(q => ({
       role_name: q.role,
       skill_name: q.skill,
       difficulty: q.difficulty,
       question: q.question,
       option_a: q.option_a,
       option_b: q.option_b,
       option_c: q.option_c,
       option_d: q.option_d,
       correct_option: q.correct_option,
       expected_time: q.expected_time || (q.difficulty === 'Hard' ? 90 : (q.difficulty === 'Easy'? 45 : 60))
    }));

    const { data: savedQuestions, error: bankError } = await supabase
       .from('questions_bank')
       .insert(insertPayload)
       .select();

    if (bankError) throw bankError;

    // 6. Create assessment_sessions mapping natively
    const { data: newSession, error: sessionError } = await supabase
       .from('assessment_sessions')
       .insert([{ user_id: userId, role_name: roleName }])
       .select()
       .single();

    if (sessionError) throw sessionError;

    // 7. Map questions to session_questions
    const sessionQuestionsPayload = savedQuestions.map((sq, idx) => ({
       session_id: newSession.id,
       question_id: sq.id,
       order_index: idx
    }));

    const { error: sqError } = await supabase.from('session_questions').insert(sessionQuestionsPayload);
    if (sqError) throw sqError;

    // Return session id to Assessment.jsx
    return { success: true, sessionId: newSession.id };

  } catch (error) {
    console.error("Failed to generate adaptive AI assessment session:", error);
    return { success: false, error: error.message || String(error) };
  }
};

