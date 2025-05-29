
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHomeWorkoutPrompt, createGymWorkoutPrompt } from './promptTemplates.ts';
import { validateWorkoutProgram, parseAIResponse } from './workoutValidator.ts';
import { storeWorkoutProgram } from './databaseOperations.ts';
import { 
  checkGenerationLimit, 
  createGenerationLog, 
  decrementGenerationCount, 
  updateGenerationLog 
} from './generationLimitManager.ts';
import { callOpenAI, createSystemMessage } from './openAIService.ts';
import { 
  processRequest, 
  enhanceUserData, 
  enhancePreferences, 
  validateWorkoutType 
} from './requestProcessor.ts';
import { 
  buildSuccessResponse, 
  buildErrorResponse, 
  buildLimitReachedResponse 
} from './responseBuilder.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userData, preferences, finalUserLanguage } = await processRequest(req);

    // Check generation limit
    const limitCheck = await checkGenerationLimit(supabase, userData.userId);
    if (limitCheck.limitReached) {
      return buildLimitReachedResponse(corsHeaders, limitCheck.remaining);
    }

    // Create log entry and decrement count
    const logEntry = await createGenerationLog(supabase, userData.userId, preferences, finalUserLanguage);
    await decrementGenerationCount(supabase, userData.userId, limitCheck.remaining);

    const logId = logEntry.id;
    const workoutType = preferences?.workoutType || 'home';
    
    validateWorkoutType(workoutType);

    const enhancedUserData = enhanceUserData(userData, finalUserLanguage);
    const enhancedPreferences = enhancePreferences(preferences, workoutType, finalUserLanguage);
    
    const selectedPrompt = workoutType === 'gym' 
      ? createGymWorkoutPrompt(enhancedUserData, enhancedPreferences)
      : createHomeWorkoutPrompt(enhancedUserData, enhancedPreferences);
    
    const systemMessage = createSystemMessage(workoutType, finalUserLanguage);
    
    try {
      const aiResponse = await callOpenAI(openAIApiKey, selectedPrompt, systemMessage);
      const generatedProgram = parseAIResponse(aiResponse);
      
      console.log('✅ Exercise program parsed successfully');
      validateWorkoutProgram(generatedProgram);
      console.log('✅ Exercise program validation passed');

      const weeklyProgram = await storeWorkoutProgram(supabase, generatedProgram, enhancedUserData, enhancedPreferences);

      // Mark generation as completed
      await updateGenerationLog(supabase, logId, 'completed', {
        programId: weeklyProgram.id,
        programName: weeklyProgram.program_name,
        workoutType,
        workoutsCreated: weeklyProgram.workoutsCreated,
        exercisesCreated: weeklyProgram.exercisesCreated
      });

      console.log('🎉 Exercise program generated and stored successfully:', {
        programId: weeklyProgram.id,
        workoutType,
        programName: weeklyProgram.program_name,
        weekStartDate: weeklyProgram.week_start_date,
        workoutsCreated: weeklyProgram.workoutsCreated,
        exercisesCreated: weeklyProgram.exercisesCreated,
        userLanguage: finalUserLanguage,
        generationsRemaining: limitCheck.remaining - 1
      });

      return buildSuccessResponse(
        corsHeaders, 
        weeklyProgram, 
        workoutType, 
        finalUserLanguage, 
        limitCheck.remaining - 1
      );

    } catch (aiError) {
      // Mark generation as failed
      await updateGenerationLog(supabase, logId, 'failed', undefined, aiError.message);
      throw aiError;
    }

  } catch (error) {
    return buildErrorResponse(corsHeaders, error);
  }
});
