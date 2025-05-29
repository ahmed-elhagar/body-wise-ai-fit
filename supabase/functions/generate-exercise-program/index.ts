
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Generating dual exercise program for:', { workoutType, preferences });

    // Enhanced structured prompt for both home and gym programs
    const prompt = `You are a certified personal trainer creating personalized exercise programs. Generate a comprehensive workout plan that includes BOTH home and gym alternatives for each day. 

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Activity Level: ${userData?.activity_level}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'None'}

PROGRAM REQUIREMENTS:
- Create a 4-week progressive program with 4-5 workout days per week
- For EACH workout day, provide BOTH home and gym versions
- Home workouts: bodyweight exercises, minimal equipment, resistance bands
- Gym workouts: full equipment access, progressive overload, compound movements
- Include proper warm-up and cool-down routines for both versions
- Provide YouTube search terms for exercise demonstrations
- Account for health conditions and limitations

RESPONSE FORMAT - Return ONLY valid JSON in this exact structure:
{
  "programOverview": {
    "name": "Dual Environment Fitness Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete fitness program with both home and gym options for maximum flexibility",
    "goals": ["${preferences?.goalType}", "improve_fitness"],
    "equipment": {
      "home": ["bodyweight", "resistance_bands", "dumbbells_optional"],
      "gym": ["full_gym_equipment", "barbells", "machines", "cables"]
    }
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "homeWorkout": {
            "workoutName": "Home Upper Body Foundation",
            "type": "home",
            "estimatedDuration": ${preferences?.availableTime || 45},
            "estimatedCalories": 280,
            "muscleGroups": ["chest", "back", "shoulders", "arms"],
            "warmUp": [
              {"name": "Arm circles", "duration": 30, "instructions": "Forward and backward arm circles"}
            ],
            "exercises": [
              {
                "name": "Push-ups",
                "sets": 3,
                "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-10' : '10-12'}",
                "restSeconds": 60,
                "muscleGroups": ["chest", "triceps", "shoulders"],
                "instructions": "Keep body straight, lower chest to floor",
                "youtubeSearchTerm": "proper push up form beginner",
                "difficulty": "${preferences?.fitnessLevel}",
                "equipment": "none",
                "alternatives": ["Wall push-ups", "Knee push-ups"]
              }
            ],
            "coolDown": [
              {"name": "Chest stretch", "duration": 30, "instructions": "Hold for 30 seconds"}
            ]
          },
          "gymWorkout": {
            "workoutName": "Gym Upper Body Strength",
            "type": "gym",
            "estimatedDuration": ${preferences?.availableTime || 45},
            "estimatedCalories": 350,
            "muscleGroups": ["chest", "back", "shoulders", "arms"],
            "warmUp": [
              {"name": "Treadmill warm-up", "duration": 5, "instructions": "Light cardio at moderate pace"}
            ],
            "exercises": [
              {
                "name": "Bench Press",
                "sets": 3,
                "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-10' : '10-12'}",
                "restSeconds": 90,
                "muscleGroups": ["chest", "triceps", "shoulders"],
                "instructions": "Lower bar to chest, press up explosively",
                "youtubeSearchTerm": "bench press proper form",
                "difficulty": "${preferences?.fitnessLevel}",
                "equipment": "barbell",
                "alternatives": ["Dumbbell press", "Machine chest press"]
              }
            ],
            "coolDown": [
              {"name": "Chest stretch", "duration": 30, "instructions": "Hold for 30 seconds"}
            ]
          }
        }
      ]
    }
  ],
  "nutritionTips": [
    "Stay hydrated during workouts",
    "Eat protein within 30 minutes post-workout",
    "Adjust nutrition based on workout intensity"
  ],
  "progressTracking": {
    "metrics": ["weight", "reps", "sets", "duration"],
    "schedule": "Track weekly progress",
    "tips": "Compare performance between home and gym workouts to optimize your routine"
  }
}

Create a complete 4-week program with both home and gym options for each workout day. Ensure exercises are appropriate for each environment and the user's fitness level.`;

    console.log('Sending request to OpenAI for dual exercise program');
    
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
            content: `You are a certified personal trainer and exercise physiologist. Always respond with valid JSON only. Create safe, effective workouts with both home and gym options for maximum flexibility. Ensure all JSON is properly formatted.` 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI dual exercise response received');

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    let generatedProgram;
    try {
      const content = data.choices[0].message.content;
      // Clean the response to ensure it's valid JSON
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedProgram = JSON.parse(cleanedContent);
      console.log('Dual exercise program parsed successfully');
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw content:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response. Please try again.');
    }

    // Validate the generated program structure
    if (!generatedProgram.weeks || !Array.isArray(generatedProgram.weeks)) {
      throw new Error('Invalid exercise program structure received from AI');
    }

    return new Response(JSON.stringify({ generatedProgram }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating dual exercise program:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to generate exercise program',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
