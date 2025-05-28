
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

    console.log('Generating exercise program for user:', userProfile?.id);

    // Enhanced structured prompt for exercise program
    const prompt = `You are a certified personal trainer creating a personalized exercise program. Generate a comprehensive workout plan with the following specifications:

USER PROFILE:
- Age: ${userProfile?.age} years old
- Gender: ${userProfile?.gender}
- Weight: ${userProfile?.weight}kg, Height: ${userProfile?.height}cm
- Fitness Goal: ${userProfile?.fitness_goal}
- Activity Level: ${userProfile?.activity_level}
- Body Shape: ${userProfile?.body_shape}
- Health Conditions: ${userProfile?.health_conditions?.join(', ') || 'None'}

PREFERENCES:
- Equipment: ${preferences?.equipment || 'Basic home equipment'}
- Duration: ${preferences?.duration || '4'} weeks
- Workout Days: ${preferences?.workoutDays || '3-4 days per week'}
- Difficulty: ${preferences?.difficulty || 'Beginner to Intermediate'}

REQUIREMENTS:
- Create both HOME and GYM workout options
- Include progressive overload principles
- Provide YouTube search terms for exercise demonstrations
- Include warm-up and cool-down routines
- Account for health conditions and limitations
- Provide alternative exercises for accessibility

RESPONSE FORMAT - Return ONLY valid JSON in this exact structure:
{
  "programOverview": {
    "name": "Personalized Fitness Program",
    "duration": "4 weeks",
    "difficulty": "intermediate",
    "description": "Complete program description",
    "goals": ["goal1", "goal2"],
    "equipment": ["equipment1", "equipment2"]
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "Upper Body Strength",
          "type": "home",
          "estimatedDuration": 45,
          "estimatedCalories": 300,
          "warmUp": [
            {"name": "Light cardio", "duration": 5, "instructions": "March in place"}
          ],
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 60,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "Keep body straight, lower chest to floor",
              "youtubeSearchTerm": "proper push up form beginner",
              "difficulty": "beginner",
              "equipment": "none",
              "alternatives": ["Wall push-ups", "Knee push-ups"]
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
    "Eat protein within 30 minutes post-workout"
  ],
  "progressTracking": {
    "metrics": ["weight", "reps", "sets", "duration"],
    "schedule": "Track weekly progress"
  }
}

Ensure exercises are appropriate for the user's fitness level and health conditions.`;

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
            content: 'You are a certified personal trainer and exercise physiologist. Always respond with valid JSON only. Create safe, effective workouts appropriate for the user\'s fitness level. Ensure all JSON is properly formatted.' 
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
