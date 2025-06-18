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
import { workoutCaching } from './workoutCaching.ts';
import { enhancedValidation } from './enhancedValidation.ts';
import { progressAnalytics } from './progressAnalytics.ts';
import { AIService } from "../_shared/aiService.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple credit checking function
const checkAndUseCredit = async (supabase: any, userId: string) => {
  try {
    // Check if user is Pro (unlimited generations)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    const isPro = !!subscription;

    if (isPro) {
      return { allowed: true, remaining: -1 };
    }

    // Check user's remaining credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_generations_remaining')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error('Failed to check user credits');
    }

    const remaining = profile.ai_generations_remaining || 0;

    if (remaining <= 0) {
      return { allowed: false, remaining: 0 };
    }

    // Decrement credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        ai_generations_remaining: remaining - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw new Error('Failed to update credits');
    }

    return { allowed: true, remaining: remaining - 1 };
  } catch (error) {
    console.error('Credit check failed:', error);
    throw error;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let language = 'en';

  try {
    console.log('=== EXERCISE PROGRAM GENERATION START ===');
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
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

    // Check credits
    const creditResult = await checkAndUseCredit(supabase, userData.userId);
    
    if (!creditResult.allowed) {
      throw createUserFriendlyError(errorCodes.INSUFFICIENT_CREDITS, language);
    }

    console.log('✅ Credit check passed:', {
      remaining: creditResult.remaining
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
        creditResult.remaining,
        true // Indicate this was cached/adapted
      );
    }

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
      console.log('🎯 Using centralized prompt service for exercise generation');
      
      // Import the service dynamically to avoid edge function issues
      const { AIPromptService } = await import('../../../src/services/aiPromptService.ts');
      
      const promptConfig = AIPromptService.getExerciseProgramPrompt(
        userData,
        preferences,
        workoutType
      );

      console.log('✅ Generated English-only prompts with language-specific formatting');

      const aiService = new AIService(openAIApiKey, anthropicApiKey, googleApiKey);
      
      const response = await aiService.generate('exercise_program', {
        messages: [
          { role: 'system', content: promptConfig.systemMessage },
          { role: 'user', content: promptConfig.userPrompt + '\n\nResponse format:\n' + promptConfig.responseFormat }
        ],
        temperature: promptConfig.temperature || 0.3,
        maxTokens: promptConfig.maxTokens || 4000,
      });

      console.log('✅ Exercise program parsed successfully');
      
      // Enhanced validation
      enhancedValidation.validateWorkoutProgram(response);
      enhancedValidation.validateWorkoutSafety(response, userData);
      
      console.log('✅ Enhanced validation passed');

      const weeklyProgram = await storeWorkoutProgram(supabase, response, enhancedUserData, enhancedPreferences);

      console.log('🎉 Exercise program generated and stored successfully:', {
        programId: weeklyProgram.id,
        workoutType,
        programName: weeklyProgram.program_name,
        weekStartDate: weeklyProgram.week_start_date,
        workoutsCreated: weeklyProgram.workoutsCreated,
        exercisesCreated: weeklyProgram.exercisesCreated,
        userLanguage: finalUserLanguage,
        generationsRemaining: creditResult.remaining,
        hadProgressContext: !!progressData
      });

      return buildSuccessResponse(
        corsHeaders, 
        weeklyProgram, 
        workoutType, 
        finalUserLanguage, 
        creditResult.remaining
      );

    } catch (aiError) {
      throw aiError;
    }

  } catch (error) {
    console.error('=== EXERCISE PROGRAM GENERATION FAILED ===', error);
    
    const errorResponse = handleExerciseProgramError(error, language);
    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode || 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
