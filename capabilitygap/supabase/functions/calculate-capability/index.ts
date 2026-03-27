// @ts-ignore: Deno URL imports are fully supported at Edge
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno URL imports are fully supported at Edge
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Expected time per question in seconds
const EXPECTED_TIME_SEC = 60;

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Extract user_id from the JSON payload
    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required in the request payload.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client with the Service Role key to bypass RLS locally on the edge
    // @ts-ignore: Deno namespace is available at runtime in Supabase Edge Functions
    const supabaseClient = createClient(
      // @ts-ignore
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch attempts for the user, joining with questions to get skill_id
    const { data: attempts, error: fetchError } = await supabaseClient
      .from('attempts')
      .select(`
        id,
        correct,
        time_taken,
        confidence_rating,
        question_id,
        questions ( skill_id )
      `)
      .eq('user_id', user_id)

    if (fetchError) throw fetchError

    if (!attempts || attempts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No attempts found for this user.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // Group attempts by skill
    const skillData: Record<string, any> = {};

    for (const attempt of attempts) {
      // Supabase nested relation object logic (handles array or object)
      const question = Array.isArray(attempt.questions) ? attempt.questions[0] : attempt.questions;
      if (!question || !question.skill_id) continue;
      
      const skillId = question.skill_id;

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
    }

    // Calculate capability scores for each skill and prepare upsert payload
    const upsertPayload = [];

    for (const [skillId, metrics] of Object.entries(skillData)) {
      // Knowledge Score: (correct / total) -> Scale 0 to 1
      const knowledgeScore = metrics.correctAnswers / metrics.totalQuestions;

      // Speed Score: (expected_time / average time_taken)
      const avgTimeTaken = metrics.totalTimeTaken / metrics.totalQuestions;
      let speedScore = EXPECTED_TIME_SEC / (avgTimeTaken || 1); // fallback to 1s to prevent Division by 0
      
      // Cap speed score horizontally at 1.0 (faster than expected doesn't arbitrarily skew capability past 100%)
      if (speedScore > 1) speedScore = 1;

      // Confidence Score: (average confidence_rating / 5) -> Scale 0 to 1
      const avgConfidence = metrics.totalConfidence / metrics.totalQuestions;
      const confidenceScore = avgConfidence / 5;

      // Final Capability Score
      // capability = 0.5 * knowledge + 0.3 * speed + 0.2 * confidence
      const capabilityScore = (0.5 * knowledgeScore) + (0.3 * speedScore) + (0.2 * confidenceScore);

      // We'll scale them to 100 conceptually for easier frontend UI usage, keeping 2 decimal precision
      upsertPayload.push({
        user_id: user_id,
        skill_id: skillId,
        knowledge_score: Math.round(knowledgeScore * 100 * 100) / 100,
        speed_score: Math.round(speedScore * 100 * 100) / 100,
        confidence_score: Math.round(confidenceScore * 100 * 100) / 100,
        capability_score: Math.round(capabilityScore * 100 * 100) / 100,
      });
    }

    // Upsert the calculated values into capability_scores table
    const { error: upsertError } = await supabaseClient
      .from('capability_scores')
      .upsert(upsertPayload, { onConflict: 'user_id,skill_id' });

    if (upsertError) throw upsertError;

    return new Response(
      JSON.stringify({ 
        message: `Capability scores successfully calculated and stored for ${upsertPayload.length} skills.`,
        data: upsertPayload 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
