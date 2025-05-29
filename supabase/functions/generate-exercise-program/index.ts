
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

    console.log('Generating exercise program for:', { workoutType, preferences });

    // Enhanced structured prompt for both home and gym programs
    const prompt = `You are a certified personal trainer creating a personalized ${workoutType.toUpperCase()} exercise program. Generate a comprehensive workout plan with the following specifications:

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Activity Level: ${userData?.activity_level}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'None'}

WORKOUT TYPE: ${workoutType.toUpperCase()}
${workoutType === 'home' ? `
HOME WORKOUT SPECIFICATIONS:
- Focus on bodyweight exercises and minimal equipment
- Include resistance bands, dumbbells (if available), and household items
- Provide alternatives for different fitness levels
- Consider space limitations
- Include exercises that can be done in small spaces
` : `
GYM WORKOUT SPECIFICATIONS:
- Utilize full gym equipment (barbells, dumbbells, machines, cables)
- Include progressive overload principles
- Focus on compound movements and isolation exercises
- Provide proper form cues and safety tips
- Include equipment alternatives if machines are occupied
`}

REQUIREMENTS:
- Create a 4-week progressive program
- Include proper warm-up and cool-down routines
- Provide YouTube search terms for exercise demonstrations
- Account for health conditions and limitations
- Include alternative exercises for accessibility
- Focus on ${preferences?.goalType} goals

RESPONSE FORMAT - Return ONLY valid JSON in this exact structure:
{
  "programOverview": {
    "name": "${workoutType === 'home' ? 'Home' : 'Gym'} Fitness Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "workoutType": "${workoutType}",
    "description": "Complete ${workoutType} program description tailored for ${preferences?.goalType}",
    "goals": ["${preferences?.goalType}", "improve_fitness"],
    "equipment": ${JSON.stringify(preferences?.equipment || [])}
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "${workoutType === 'home' ? 'Home Upper Body' : 'Gym Upper Body Strength'}",
          "type": "${workoutType}",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": ${workoutType === 'gym' ? 350 : 280},
          "muscleGroups": ["chest", "back", "shoulders", "arms"],
          "warmUp": [
            {"name": "Light cardio", "duration": 5, "instructions": "${workoutType === 'home' ? 'March in place or jumping jacks' : 'Treadmill or stationary bike'}"}
          ],
          "exercises": [
            {
              "name": "${workoutType === 'home' ? 'Push-ups' : 'Bench Press'}",
              "sets": 3,
              "reps": "${preferences?.fitnessLevel === 'beginner' ? '8-10' : '10-12'}",
              "restSeconds": 60,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "${workoutType === 'home' ? 'Keep body straight, lower chest to floor' : 'Lower bar to chest, press up explosively'}",
              "youtubeSearchTerm": "${workoutType === 'home' ? 'proper push up form beginner' : 'bench press proper form'}",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "${workoutType === 'home' ? 'none' : 'barbell'}",
              "alternatives": ${JSON.stringify(workoutType === 'home' ? ["Wall push-ups", "Knee push-ups"] : ["Dumbbell press", "Machine chest press"])}
            }
          ],
          "coolDown": [
            {"name": "Chest stretch", "duration": 30, "instructions": "Hold for 30 seconds"}
          ]
        }
      ]
    }
  ],
  "nutritionTips": [
    "Stay hydrated during workouts",
    "Eat protein within 30 minutes post-workout",
    "${workoutType === 'gym' ? 'Consider pre-workout nutrition for energy' : 'Keep water nearby during home workouts'}"
  ],
  "progressTracking": {
    "metrics": ["weight", "reps", "sets", "duration"],
    "schedule": "Track weekly progress",
    "tips": "${workoutType === 'home' ? 'Take progress photos and measure body measurements' : 'Log weights and track strength gains'}"
  }
}

Create a complete 4-week program with 4-5 workouts per week. Ensure exercises are appropriate for ${workoutType} environment and the user's fitness level.`;

    console.log('Sending request to OpenAI for exercise program');
    
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
            content: `You are a certified personal trainer and exercise physiologist specializing in ${workoutType} workouts. Always respond with valid JSON only. Create safe, effective workouts appropriate for the user's fitness level and ${workoutType} environment. Ensure all JSON is properly formatted.` 
          },
          { role: 'user', content: prompt }
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

    let generatedProgram;
    try {
      const content = data.choices[0].message.content;
      // Clean the response to ensure it's valid JSON
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedProgram = JSON.parse(cleanedContent);
      console.log('Exercise program parsed successfully');
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
