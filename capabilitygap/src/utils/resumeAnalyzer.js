import { supabase } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOrGenerateSkillsForRole } from './aiQuestionGenerator';

export const analyzeResumeAndGenerateRoadmap = async (userId, targetRole, resumeText) => {
  if (!userId) userId = '00000000-0000-0000-0000-000000000000'; // fallback anonymous

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is missing!");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Step 1: Save the resume text natively
    const { data: resumeRecord, error: resumeErr } = await supabase
      .from('resumes')
      .insert([{ user_id: userId, target_role: targetRole, resume_text: resumeText.substring(0, 50000) }])
      .select()
      .single();

    if (resumeErr) throw resumeErr;

    const resumeId = resumeRecord.id;

    // Step 2: Get required skills natively
    const requiredSkills = await getOrGenerateSkillsForRole(targetRole);

    // Step 3: Extract Skills from Resume Text via Gemini
    const extractPrompt = `
You are an expert technical recruiter analyzing a resume for the role of ${targetRole}.
Extract all technical skills, theoretical knowledge, tools, and relevant soft skills.
Assign a proficiency to each based on the text contexts (Beginner, Intermediate, Advanced, Expert).

Resume Text:
${resumeText.substring(0, 10000)}

Return EXACTLY a JSON array matching this format (no markdown):
[
  {
    "skill_name": "React",
    "category": "Technology",
    "proficiency": "Advanced"
  }
]`;

    let extractResult = await model.generateContent(extractPrompt);
    let extractText = extractResult.response.text();
    extractText = extractText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    // Fallback parser wrapper
    let parsedSkills = [];
    try {
      parsedSkills = JSON.parse(extractText);
    } catch (err) {
      console.error("Gemini failed exact JSON formatting for extraction:", extractText);
      throw new Error("AI failed to extract skills precisely.");
    }

    // Step 4: Insert parsed skills into DB
    const skillPayload = parsedSkills.map(s => ({
      resume_id: resumeId,
      user_id: userId,
      skill_name: s.skill_name,
      category: s.category || 'General',
      proficiency: s.proficiency || 'Beginner'
    }));

    await supabase.from('resume_skills').insert(skillPayload);

    // Step 5: Generate Gap Analysis & Roadmap
    const gapPrompt = `
You are an AI Capability Intelligence System.
The user's target role natively requires these skills: ${requiredSkills.join(', ')}.
The user's extracted resume skills are natively: 
${parsedSkills.map(s => `- ${s.skill_name} (${s.proficiency})`).join('\n')}

Perform a Gap Analysis comparing their current skills against the target role requirements.
Determine gap levels (High, Medium, Low) for missing or under-proficient skills.
Generate a structured learning roadmap to bridge these specific gaps.

Return EXACTLY a JSON object matching this schema (no markdown, no extra text):
{
  "gaps": [
    {
      "skill_name": "System Design",
      "resume_proficiency": "None",
      "required_proficiency": "Intermediate",
      "gap_level": "High",
      "recommendation": "Study Grokking the System Design Interview and practice large scale architectures."
    }
  ],
  "roadmap": {
    "summary": "Focus heavily on architecture and advanced state management.",
    "phases": [
      {
        "title": "Phase 1: Foundations & High Gaps (Weeks 1-3)",
        "tasks": ["Task 1 string", "Task 2 string"]
      }
    ]
  }
}`;

    let gapResult = await model.generateContent(gapPrompt);
    let gapText = gapResult.response.text();
    gapText = gapText.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsedGapData = {};
    try {
      parsedGapData = JSON.parse(gapText);
    } catch (err) {
      console.error("Gemini failed JSON formatting for gap analysis:", gapText);
      throw new Error("AI failed to compute capability gaps precisely.");
    }

    // Step 6: Insert Gaps and Roadmap natively into DB
    const gapsPayload = (parsedGapData.gaps || []).map(g => ({
      resume_id: resumeId,
      user_id: userId,
      skill_name: g.skill_name,
      resume_proficiency: g.resume_proficiency || 'None',
      required_proficiency: g.required_proficiency || 'Intermediate',
      gap_level: g.gap_level || 'Medium',
      recommendation: g.recommendation || ''
    }));

    if (gapsPayload.length > 0) {
      await supabase.from('resume_gaps').insert(gapsPayload);
    }

    const roadmapPayload = {
      resume_id: resumeId,
      user_id: userId,
      roadmap_content: parsedGapData.roadmap || {}
    };

    await supabase.from('resume_roadmaps').insert([roadmapPayload]);

    // Format final response for UI mapping
    return {
      success: true,
      resumeId: resumeId,
      skills: parsedSkills,
      gaps: parsedGapData.gaps || [],
      roadmap: parsedGapData.roadmap || {}
    };

  } catch (error) {
    console.error("Resume Analysis failed:", error);
    return { success: false, error: error.message || String(error) };
  }
};
