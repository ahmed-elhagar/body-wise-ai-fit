
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
    const { userData, preferences } = await req.json();
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

    console.log('🚀 Generating exercise program for:', { 
      userId: userData?.userId?.substring(0, 8) + '...', 
      workoutType: preferences?.workoutType,
      goalType: preferences?.goalType,
      fitnessLevel: preferences?.fitnessLevel
    });

    // Determine workout type - default to 'home' if not specified
    const workoutType = preferences?.workoutType || 'home';
    
    // Choose the appropriate prompt based on workout type
    const selectedPrompt = workoutType === 'gym' 
      ? createGymWorkoutPrompt(userData, preferences)
      : createHomeWorkoutPrompt(userData, preferences);
    
    console.log(`📤 Sending request to OpenAI for ${workoutType} exercise program`);
    
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
            content: `You are a certified personal trainer and exercise specialist. Always respond with valid JSON only. Create safe, effective workouts for ${workoutType} environment. Focus on proper form and progressive overload principles.` 
          },
          { role: 'user', content: selectedPrompt }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📥 OpenAI exercise response received successfully');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    // Parse and validate the AI response
    const generatedProgram = parseAIResponse(data.choices[0].message.content);
    console.log('✅ Exercise program parsed successfully');

    validateWorkoutProgram(generatedProgram);
    console.log('✅ Exercise program validation passed');

    // Add workout type to preferences for storage
    const preferencesWithType = {
      ...preferences,
      workoutType
    };

    // Store the program in the database
    const weeklyProgram = await storeWorkoutProgram(supabase, generatedProgram, userData, preferencesWithType);

    console.log('🎉 Exercise program generated and stored successfully:', {
      programId: weeklyProgram.id,
      workoutType,
      programName: weeklyProgram.program_name
    });

    return new Response(JSON.stringify({ 
      success: true,
      programId: weeklyProgram.id,
      workoutType,
      programName: weeklyProgram.program_name,
      message: `${workoutType === 'gym' ? 'Gym' : 'Home'} exercise program generated successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Error generating exercise program:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate exercise program';
    if (error.message.includes('OpenAI')) {
      errorMessage = 'AI service error - please try again';
    } else if (error.message.includes('parse')) {
      errorMessage = 'Failed to process AI response - please try again';
    } else if (error.message.includes('validation')) {
      errorMessage = 'Generated program validation failed - please try again';
    } else if (error.message.includes('database') || error.message.includes('Supabase')) {
      errorMessage = 'Database error - please try again';
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
