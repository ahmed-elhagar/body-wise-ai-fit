
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
    const { userProfile, preferences } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Generate a personalized exercise program for a ${userProfile.age} year old ${userProfile.gender} with:
    - Fitness Goal: ${userProfile.fitness_goal}
    - Activity Level: ${userProfile.activity_level}
    - Body Shape: ${userProfile.body_shape}
    - Health Conditions: ${userProfile.health_conditions?.join(', ') || 'None'}
    - Equipment: ${preferences.equipment || 'Bodyweight, Basic home equipment'}
    - Duration: ${preferences.duration || '4 weeks'}
    - Workout Days: ${preferences.workoutDays || '3-4 days per week'}

    Create a comprehensive program with:
    - Weekly workout schedule
    - Exercise details with sets, reps, rest periods
    - Progression plan
    - YouTube video suggestions for each exercise
    - Muscle groups targeted
    - Estimated calories burned

    Format as JSON:
    {
      "programOverview": {
        "name": "program name",
        "duration": "X weeks",
        "difficulty": "beginner/intermediate/advanced",
        "description": "brief description"
      },
      "weeks": [
        {
          "weekNumber": 1,
          "focus": "week focus",
          "workouts": [
            {
              "day": 1,
              "dayName": "Monday",
              "workoutName": "Upper Body Strength",
              "estimatedDuration": 45,
              "estimatedCalories": 300,
              "exercises": [
                {
                  "name": "Push-ups",
                  "sets": 3,
                  "reps": "10-12",
                  "restSeconds": 60,
                  "muscleGroups": ["chest", "triceps"],
                  "instructions": "detailed form instructions",
                  "youtubeSearchTerm": "proper push up form",
                  "difficulty": "beginner",
                  "equipment": "none"
                }
              ]
            }
          ]
        }
      ]
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a certified personal trainer and exercise physiologist. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedProgram = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ generatedProgram }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating exercise program:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
