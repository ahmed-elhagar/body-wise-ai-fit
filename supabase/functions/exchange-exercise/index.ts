
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

    console.log('🔄 Exchange exercise request:', { exerciseId, reason, userLanguage, userId });

    if (!exerciseId) {
      throw new Error('Exercise ID is required');
    }

    // Get original exercise details with proper error handling
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
      console.error('Exercise not found for ID:', exerciseId);
      throw new Error('Exercise not found');
    }

    console.log('✅ Found original exercise:', originalExercise.name);

    // Generate exchange prompt with comprehensive instructions
    const exchangePrompt = `
You are a fitness expert AI. The user wants to exchange the following exercise:

**Current Exercise:** ${originalExercise.name}
**Sets:** ${originalExercise.sets || 3}
**Reps:** ${originalExercise.reps || '12'}
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
  "sets": ${originalExercise.sets || 3},
  "reps": "${originalExercise.reps || '12'}",
  "rest_seconds": ${originalExercise.rest_seconds || 60},
  "muscle_groups": ${JSON.stringify(originalExercise.muscle_groups || ['full_body'])},
  "equipment": "required equipment",
  "difficulty": "${originalExercise.difficulty || 'intermediate'}",
  "instructions": "Detailed instructions in ${userLanguage}",
  "youtube_search_term": "Search term for YouTube tutorial"
}

IMPORTANT: Respond with ONLY valid JSON, no additional text or markdown formatting.
`;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🤖 Calling OpenAI API...');

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
            content: 'You are a professional fitness trainer AI that provides exercise alternatives. Always respond with valid JSON only, no markdown or additional formatting.'
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
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    console.log('🤖 AI Response received:', aiContent);

    // Parse the AI response with better error handling
    let newExerciseData;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedContent = aiContent.trim().replace(/```json\n?|\n?```/g, '');
      newExerciseData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      console.error('Parse error:', parseError);
      throw new Error(`Invalid AI response format: ${parseError.message}`);
    }

    // Validate required fields
    if (!newExerciseData.name) {
      throw new Error('AI response missing exercise name');
    }

    console.log('✅ Parsed new exercise data:', newExerciseData);

    // Update the exercise in the database with the new AI-generated data
    const { data: updatedExercise, error: updateError } = await supabaseClient
      .from('exercises')
      .update({
        name: newExerciseData.name,
        sets: newExerciseData.sets || originalExercise.sets || 3,
        reps: newExerciseData.reps || originalExercise.reps || '12',
        rest_seconds: newExerciseData.rest_seconds || originalExercise.rest_seconds || 60,
        muscle_groups: newExerciseData.muscle_groups || originalExercise.muscle_groups || ['full_body'],
        equipment: newExerciseData.equipment || originalExercise.equipment || 'bodyweight',
        difficulty: newExerciseData.difficulty || originalExercise.difficulty || 'intermediate',
        instructions: newExerciseData.instructions || 'No instructions provided',
        youtube_search_term: newExerciseData.youtube_search_term || newExerciseData.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Failed to update exercise: ${updateError.message}`);
    }

    console.log('✅ Exercise exchanged successfully:', updatedExercise.name);

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
