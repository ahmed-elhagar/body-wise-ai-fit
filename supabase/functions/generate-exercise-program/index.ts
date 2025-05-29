
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
    const { workoutType, userData, preferences } = await req.json();
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

    console.log('Generating exercise program for:', { workoutType, preferences });

    // Choose the appropriate prompt based on workout type
    const selectedPrompt = preferences?.workoutType === 'gym' 
      ? createGymWorkoutPrompt(userData, preferences)
      : createHomeWorkoutPrompt(userData, preferences);
    
    console.log(`Sending request to OpenAI for ${preferences?.workoutType || 'home'} exercise program`);
    
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
            content: `You are a certified personal trainer. Always respond with valid JSON only. Create safe, effective workouts appropriate for the specified environment.` 
          },
          { role: 'user', content: selectedPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI exercise response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse and validate the AI response
    const generatedProgram = parseAIResponse(data.choices[0].message.content);
    console.log('Exercise program parsed successfully');

    validateWorkoutProgram(generatedProgram);

    // Store the program in the database
    const weeklyProgram = await storeWorkoutProgram(supabase, generatedProgram, userData, preferences);

    return new Response(JSON.stringify({ 
      success: true,
      programId: weeklyProgram.id,
      generatedProgram 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating exercise program:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate exercise program',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
