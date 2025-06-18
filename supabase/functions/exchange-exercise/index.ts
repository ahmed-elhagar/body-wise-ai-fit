import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { AIService } from "../_shared/aiService.ts";

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { exerciseId, reason, preferences, userLanguage = 'en', userId } = await req.json();

    console.log('🔄 Exchange exercise request:', { exerciseId, reason, userLanguage, userId });

    if (!exerciseId) {
      throw new Error('Exercise ID is required');
    }

    // Optimized query with timeout handling - use single query with timeout
    console.log('🔍 Fetching exercise with ID:', exerciseId);
    
    const { data: originalExercise, error: exerciseError } = await supabaseClient
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .single();

    if (exerciseError) {
      console.error('❌ Exercise query error:', exerciseError);
      if (exerciseError.code === '57014') {
        throw new Error('Database query timed out. Please try again.');
      }
      throw new Error(`Failed to find exercise: ${exerciseError.message}`);
    }

    if (!originalExercise) {
      console.error('❌ Exercise not found for ID:', exerciseId);
      throw new Error('Exercise not found');
    }

    console.log('✅ Found original exercise:', originalExercise.name);

    // Use centralized prompt service
    console.log('🎯 Using centralized prompt service for exercise exchange');
    
    // Import the service dynamically
    const { AIPromptService } = await import('../../../src/services/aiPromptService.ts');
    
    const promptConfig = AIPromptService.getExerciseExchangePrompt(
      originalExercise,
      reason,
      preferences,
      userLanguage
    );

    console.log('✅ Generated English-only exercise exchange prompt with language formatting');

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('🤖 Using AI service for exercise exchange...');

    // Use the AI service with timeout handling
    const aiService = new AIService(openAIApiKey, anthropicApiKey, googleApiKey);
    
    const response = await aiService.generate('exercise_exchange', {
      messages: [
        { role: 'system', content: promptConfig.systemMessage },
        { role: 'user', content: promptConfig.userPrompt + '\n\nResponse format:\n' + promptConfig.responseFormat }
      ],
      temperature: promptConfig.temperature || 0.7,
      maxTokens: promptConfig.maxTokens || 1000,
    });

    const aiContent = response.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    console.log('✅ AI Response received:', aiContent.substring(0, 200) + '...');

    // Parse the AI response with better error handling
    let newExerciseData;
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedContent = aiContent.trim().replace(/```json\n?|\n?```/g, '');
      newExerciseData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format. Please try again.');
    }

    // Validate required fields
    if (!newExerciseData.name) {
      throw new Error('AI response missing exercise name');
    }

    console.log('✅ Parsed new exercise data:', newExerciseData.name);

    // Update the exercise in the database with optimized query
    console.log('🔄 Updating exercise in database...');
    
    const { data: updatedExercise, error: updateError } = await Promise.race([
      supabaseClient
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
        .single(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database update timeout')), 10000)
      )
    ]);

    if (updateError) {
      console.error('❌ Update error:', updateError);
      if (updateError.code === '57014') {
        throw new Error('Database update timed out. Please try again.');
      }
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
