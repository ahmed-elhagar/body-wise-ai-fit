
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHomeWorkoutPrompt, createGymWorkoutPrompt } from './promptTemplates.ts';
import { validateWorkoutProgram, parseAIResponse } from './workoutValidator.ts';
import { storeWorkoutProgram } from './databaseOperations.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userData, preferences, userLanguage } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const finalUserLanguage = userLanguage || userData?.preferred_language || preferences?.userLanguage || 'en';

    console.log('🚀 Exercise generation request received:', {
      userId: userData?.userId?.substring(0, 8) + '...',
      workoutType: preferences?.workoutType,
      weekStartDate: preferences?.weekStartDate,
      weekOffset: preferences?.weekOffset,
      goalType: preferences?.goalType,
      fitnessLevel: preferences?.fitnessLevel,
      userLanguage: finalUserLanguage
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!userData?.userId) {
      throw new Error('User ID is required');
    }

    // Manually check generation limit first
    console.log('🔍 Checking AI generation limit...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_generations_remaining')
      .eq('id', userData.userId)
      .single();

    if (profileError) {
      console.error('❌ Error fetching user profile:', profileError);
      throw new Error('Failed to check generation limit');
    }

    if (!profile || profile.ai_generations_remaining <= 0) {
      console.log('🚫 Generation limit reached for user');
      return new Response(JSON.stringify({
        error: 'AI generation limit reached',
        remaining: profile?.ai_generations_remaining || 0,
        limitReached: true
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create log entry with valid status - using 'active' instead of 'started'
    console.log('📝 Creating generation log...');
    const { data: logEntry, error: logError } = await supabase
      .from('ai_generation_logs')
      .insert({
        user_id: userData.userId,
        generation_type: 'exercise_program',
        prompt_data: {
          workoutType: preferences?.workoutType || 'home',
          goalType: preferences?.goalType,
          fitnessLevel: preferences?.fitnessLevel,
          userLanguage: finalUserLanguage,
          weekStartDate: preferences?.weekStartDate
        },
        status: 'pending',
        credits_used: 1
      })
      .select()
      .single();

    if (logError) {
      console.error('❌ Error creating log entry:', logError);
      throw new Error('Failed to create generation log');
    }

    const logId = logEntry.id;

    // Decrement the count
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        ai_generations_remaining: profile.ai_generations_remaining - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userData.userId);

    if (updateError) {
      console.error('❌ Error updating generation count:', updateError);
      throw new Error('Failed to update generation count');
    }

    console.log('✅ Generation limit checked, remaining:', profile.ai_generations_remaining - 1);

    const workoutType = preferences?.workoutType || 'home';
    
    if (!['home', 'gym'].includes(workoutType)) {
      throw new Error('Invalid workout type. Must be "home" or "gym"');
    }

    const enhancedPreferences = {
      ...preferences,
      userLanguage: finalUserLanguage
    };

    const enhancedUserData = {
      ...userData,
      preferred_language: finalUserLanguage
    };
    
    const selectedPrompt = workoutType === 'gym' 
      ? createGymWorkoutPrompt(enhancedUserData, enhancedPreferences)
      : createHomeWorkoutPrompt(enhancedUserData, enhancedPreferences);
    
    console.log(`📤 Sending request to OpenAI for ${workoutType} exercise program in ${finalUserLanguage}`);
    
    const systemMessage = finalUserLanguage === 'ar' 
      ? `أنت مدرب شخصي معتمد ومتخصص في التمارين الرياضية. اكتب استجابتك بتنسيق JSON صحيح فقط. قم بإنشاء تمارين آمنة وفعالة لبيئة ${workoutType === 'gym' ? 'الصالة الرياضية' : 'المنزل'}. ركز على الشكل الصحيح والزيادة التدريجية والتعليمات الواضحة. استخدم اللغة العربية لأسماء التمارين والتعليمات.`
      : `You are a certified personal trainer and exercise specialist. Always respond with valid JSON only. Create safe, effective workouts for ${workoutType} environment. Focus on proper form, progressive overload, and clear instructions. Use ${finalUserLanguage === 'en' ? 'English' : finalUserLanguage} for exercise names and instructions.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: systemMessage
          },
          { role: 'user', content: selectedPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      
      // Mark generation as failed
      await supabase
        .from('ai_generation_logs')
        .update({
          status: 'failed',
          error_message: `OpenAI API error: ${response.status}`
        })
        .eq('id', logId);
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📥 OpenAI exercise response received successfully');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      await supabase
        .from('ai_generation_logs')
        .update({
          status: 'failed',
          error_message: 'Invalid response structure from OpenAI API'
        })
        .eq('id', logId);
      throw new Error('Invalid response structure from OpenAI API');
    }

    const generatedProgram = parseAIResponse(data.choices[0].message.content);
    console.log('✅ Exercise program parsed successfully');

    validateWorkoutProgram(generatedProgram);
    console.log('✅ Exercise program validation passed');

    const finalEnhancedPreferences = {
      ...enhancedPreferences,
      workoutType,
      weekStartDate: preferences?.weekStartDate,
      weekOffset: preferences?.weekOffset,
      userLanguage: finalUserLanguage
    };

    const weeklyProgram = await storeWorkoutProgram(supabase, generatedProgram, enhancedUserData, finalEnhancedPreferences);

    // Mark generation as completed
    await supabase
      .from('ai_generation_logs')
      .update({
        status: 'completed',
        response_data: {
          programId: weeklyProgram.id,
          programName: weeklyProgram.program_name,
          workoutType,
          workoutsCreated: weeklyProgram.workoutsCreated,
          exercisesCreated: weeklyProgram.exercisesCreated
        }
      })
      .eq('id', logId);

    console.log('🎉 Exercise program generated and stored successfully:', {
      programId: weeklyProgram.id,
      workoutType,
      programName: weeklyProgram.program_name,
      weekStartDate: weeklyProgram.week_start_date,
      workoutsCreated: weeklyProgram.workoutsCreated,
      exercisesCreated: weeklyProgram.exercisesCreated,
      userLanguage: finalUserLanguage,
      generationsRemaining: profile.ai_generations_remaining - 1
    });

    const successMessage = finalUserLanguage === 'ar'
      ? `تم إنشاء وحفظ برنامج تمارين ${workoutType === 'gym' ? 'الصالة الرياضية' : 'المنزل'} بنجاح`
      : `${workoutType === 'gym' ? 'Gym' : 'Home'} exercise program generated successfully`;

    return new Response(JSON.stringify({ 
      success: true,
      programId: weeklyProgram.id,
      workoutType,
      programName: weeklyProgram.program_name,
      weekStartDate: weeklyProgram.week_start_date,
      workoutsCreated: weeklyProgram.workoutsCreated,
      exercisesCreated: weeklyProgram.exercisesCreated,
      userLanguage: finalUserLanguage,
      generationsRemaining: profile.ai_generations_remaining - 1,
      message: successMessage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error generating exercise program:', error);
    
    let errorMessage = 'Failed to generate exercise program';
    if (error.message.includes('OpenAI')) {
      errorMessage = 'AI service error - please try again';
    } else if (error.message.includes('parse')) {
      errorMessage = 'Failed to process AI response - please try again';
    } else if (error.message.includes('validation')) {
      errorMessage = 'Generated program validation failed - please try again';
    } else if (error.message.includes('database') || error.message.includes('Supabase')) {
      errorMessage = 'Database error - please try again';
    } else if (error.message.includes('User ID')) {
      errorMessage = 'Authentication required - please sign in';
    } else if (error.message.includes('limit')) {
      errorMessage = 'AI generation limit reached';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
