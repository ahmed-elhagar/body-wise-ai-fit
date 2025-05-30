
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { exerciseId, reason, preferences, userLanguage = 'en', userId } = await req.json();

    console.log('🔄 Exchange exercise request:', { exerciseId, reason, userLanguage });

    // Get original exercise details - fix the query to get single exercise
    const { data: originalExercise, error: exerciseError } = await supabaseClient
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .single();

    if (exerciseError) {
      console.error('Exercise query error:', exerciseError);
      throw new Error(`Failed to get exercise: ${exerciseError.message}`);
    }

    if (!originalExercise) {
      throw new Error('Exercise not found');
    }

    // Generate exchange prompt - AI will automatically detect muscle groups
    const exchangePrompt = `
You are a fitness expert AI. The user wants to exchange the following exercise:

**Current Exercise:** ${originalExercise.name}
**Sets:** ${originalExercise.sets}
**Reps:** ${originalExercise.reps}
**Equipment:** ${originalExercise.equipment || 'bodyweight'}
**Muscle Groups:** ${originalExercise.muscle_groups?.join(', ') || 'full body'}
**Instructions:** ${originalExercise.instructions || 'No instructions provided'}

**Reason for Exchange:** ${reason}

**User Equipment Preferences:**
${preferences?.equipment ? `- Available Equipment: ${preferences.equipment.join(', ')}` : '- Use any suitable equipment'}

Please provide a suitable alternative exercise that:
1. Targets the SAME muscle groups as the original exercise
2. Matches the user's available equipment (if specified)
3. Has similar intensity/difficulty level
4. Addresses the user's reason for exchange
5. Maintains the same workout structure (sets/reps pattern)

Respond with a JSON object in this exact format:
{
  "name": "Exercise name in ${userLanguage}",
  "sets": ${originalExercise.sets},
  "reps": "${originalExercise.reps}",
  "rest_seconds": ${originalExercise.rest_seconds || 60},
  "muscle_groups": ${JSON.stringify(originalExercise.muscle_groups || ['full_body'])},
  "equipment": "required equipment",
  "difficulty": "${originalExercise.difficulty || 'intermediate'}",
  "instructions": "Detailed instructions in ${userLanguage}",
  "youtube_search_term": "Search term for YouTube tutorial"
}

Ensure the response is valid JSON only, no additional text.
`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness trainer AI that provides exercise alternatives. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: exchangePrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    // Parse the AI response
    let newExerciseData;
    try {
      newExerciseData = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Invalid AI response format');
    }

    // Update the exercise in the database
    const { data: updatedExercise, error: updateError } = await supabaseClient
      .from('exercises')
      .update({
        name: newExerciseData.name,
        sets: newExerciseData.sets,
        reps: newExerciseData.reps,
        rest_seconds: newExerciseData.rest_seconds,
        muscle_groups: newExerciseData.muscle_groups,
        equipment: newExerciseData.equipment,
        difficulty: newExerciseData.difficulty,
        instructions: newExerciseData.instructions,
        youtube_search_term: newExerciseData.youtube_search_term,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Failed to update exercise: ${updateError.message}`);
    }

    console.log('✅ Exercise exchanged successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Exercise exchanged successfully',
        newExercise: updatedExercise,
        originalExercise: originalExercise.name,
        reason: reason
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Exchange exercise error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to exchange exercise'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
