
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHomeWorkoutPrompt, createGymWorkoutPrompt } from './promptTemplates.ts';
import { validateWorkoutProgram, parseAIResponse } from './workoutValidator.ts';
import { storeWorkoutProgram } from './databaseOperations.ts';
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
import { 
  handleExerciseProgramError, 
  createUserFriendlyError, 
  errorCodes, 
  ExerciseProgramError 
} from './enhancedErrorHandling.ts';
import { enhancedRateLimiting } from './enhancedRateLimiting.ts';
import { workoutCaching } from './workoutCaching.ts';
import { enhancedValidation } from './enhancedValidation.ts';
import { progressAnalytics } from './progressAnalytics.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let logId: string | null = null;
  let language = 'en';

  try {
    console.log('=== ENHANCED EXERCISE PROGRAM GENERATION START ===');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openAIApiKey) {
      throw new ExerciseProgramError(
        'OpenAI API key not configured',
        errorCodes.AI_GENERATION_FAILED,
        500
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new ExerciseProgramError(
        'Supabase configuration missing',
        errorCodes.DATABASE_ERROR,
        500
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { userData, preferences, finalUserLanguage } = await processRequest(req);
    language = finalUserLanguage;

    console.log('🌐 Language Configuration:', { language });

    // Enhanced validation
    enhancedValidation.validateUserProfile(userData);
    enhancedValidation.validateExercisePreferences(preferences);

    // Enhanced rate limiting check
    const rateLimitResult = await enhancedRateLimiting.checkRateLimit(userData.userId);
    
    if (!rateLimitResult.allowed) {
      throw createUserFriendlyError(errorCodes.RATE_LIMIT_EXCEEDED, language);
    }

    console.log('✅ Rate limit check passed:', {
      remaining: rateLimitResult.remaining,
      isPro: rateLimitResult.isPro
    });

    // Check for existing similar program (intelligent caching)
    const workoutType = preferences?.workoutType || 'home';
    const fitnessLevel = preferences?.fitnessLevel || 'beginner';
    const goalType = preferences?.goalType || 'general_fitness';
    
    const existingProgram = await workoutCaching.checkExistingProgram(
      userData.userId,
      workoutType,
      fitnessLevel,
      goalType
    );

    if (existingProgram) {
      console.log('✅ Found suitable existing program, reusing with modifications');
      
      // Clone and adapt existing program for new week
      const adaptedProgram = await storeWorkoutProgram(
        supabase, 
        existingProgram, 
        userData, 
        { ...preferences, isAdaptation: true }
      );

      return buildSuccessResponse(
        corsHeaders,
        adaptedProgram,
        workoutType,
        language,
        rateLimitResult.remaining,
        true // Indicate this was cached/adapted
      );
    }

    // Use credit and create log entry
    logId = await enhancedRateLimiting.useCredit(
      userData.userId,
      'exercise_program',
      { userData, preferences, language, workoutType }
    );

    validateWorkoutType(workoutType);

    const enhancedUserData = enhanceUserData(userData, finalUserLanguage);
    const enhancedPreferences = enhancePreferences(preferences, workoutType, finalUserLanguage);
    
    // Get user's fitness progress for personalized recommendations
    const progressData = await progressAnalytics.calculateFitnessProgress(userData.userId);
    if (progressData) {
      enhancedPreferences.progressContext = progressData;
      console.log('📊 User progress context added:', {
        averageCompletion: progressData.averageCompletionRate,
        currentStreak: progressData.currentStreak
      });
    }
    
    const selectedPrompt = workoutType === 'gym' 
      ? createGymWorkoutPrompt(enhancedUserData, enhancedPreferences)
      : createHomeWorkoutPrompt(enhancedUserData, enhancedPreferences);
    
    const systemMessage = createSystemMessage(workoutType, finalUserLanguage);
    
    try {
      console.log('🤖 Sending enhanced request to OpenAI...');
      const aiResponse = await callOpenAI(openAIApiKey, selectedPrompt, systemMessage);
      const generatedProgram = parseAIResponse(aiResponse);
      
      console.log('✅ Exercise program parsed successfully');
      
      // Enhanced validation
      enhancedValidation.validateWorkoutProgram(generatedProgram);
      enhancedValidation.validateWorkoutSafety(generatedProgram, userData);
      
      console.log('✅ Enhanced validation passed');

      const weeklyProgram = await storeWorkoutProgram(supabase, generatedProgram, enhancedUserData, enhancedPreferences);

      // Complete generation log as successful
      if (logId) {
        await enhancedRateLimiting.completeGeneration(logId, true, {
          programId: weeklyProgram.id,
          programName: weeklyProgram.program_name,
          workoutType,
          workoutsCreated: weeklyProgram.workoutsCreated,
          exercisesCreated: weeklyProgram.exercisesCreated,
          progressContext: progressData
        });
      }

      console.log('🎉 Enhanced exercise program generated and stored successfully:', {
        programId: weeklyProgram.id,
        workoutType,
        programName: weeklyProgram.program_name,
        weekStartDate: weeklyProgram.week_start_date,
        workoutsCreated: weeklyProgram.workoutsCreated,
        exercisesCreated: weeklyProgram.exercisesCreated,
        userLanguage: finalUserLanguage,
        generationsRemaining: rateLimitResult.remaining - (rateLimitResult.isPro ? 0 : 1),
        hadProgressContext: !!progressData
      });

      return buildSuccessResponse(
        corsHeaders, 
        weeklyProgram, 
        workoutType, 
        finalUserLanguage, 
        rateLimitResult.isPro ? -1 : rateLimitResult.remaining - 1
      );

    } catch (aiError) {
      // Complete generation log as failed
      if (logId) {
        await enhancedRateLimiting.completeGeneration(
          logId, 
          false, 
          undefined, 
          aiError.message
        );
      }
      throw aiError;
    }

  } catch (error) {
    console.error('=== ENHANCED EXERCISE PROGRAM GENERATION FAILED ===', error);
    
    // Complete generation log as failed
    if (logId) {
      await enhancedRateLimiting.completeGeneration(
        logId, 
        false, 
        undefined, 
        error.message
      );
    }
    
    const errorResponse = handleExerciseProgramError(error, language);
    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
