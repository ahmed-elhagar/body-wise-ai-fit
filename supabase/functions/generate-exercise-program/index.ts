
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Create focused prompts for home vs gym workouts
    const homeWorkoutPrompt = `You are a certified personal trainer creating a HOME WORKOUT program. Generate ONLY exercises that can be done at home with minimal equipment.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Activity Level: ${userData?.activity_level}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'None'}

HOME WORKOUT REQUIREMENTS:
- ONLY bodyweight exercises, resistance bands, light dumbbells (optional)
- NO gym machines, barbells, heavy equipment
- Exercises must be doable in a small space
- Focus on functional movements and compound exercises
- 4-week progressive program with 4-5 workout days per week

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "programOverview": {
    "name": "Home Fitness Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete home workout program using bodyweight and minimal equipment",
    "goals": ["${preferences?.goalType}", "improve_fitness"],
    "equipment": ["bodyweight", "resistance_bands", "light_dumbbells_optional"]
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "workouts": [
        {
          "day": 1,
          "dayName": "Monday",
          "workoutName": "Upper Body Foundation",
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 250,
          "muscleGroups": ["chest", "back", "shoulders", "arms"],
          "exercises": [
            {
              "name": "Push-ups",
              "sets": 3,
              "reps": "8-12",
              "restSeconds": 60,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "Keep body straight, lower chest to floor, push up explosively",
              "youtubeSearchTerm": "proper push up form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "bodyweight",
              "orderNumber": 1
            },
            {
              "name": "Bodyweight Rows",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 60,
              "muscleGroups": ["back", "biceps"],
              "instructions": "Use table or bed, pull body up keeping straight line",
              "youtubeSearchTerm": "bodyweight row home",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "table_or_bed",
              "orderNumber": 2
            }
          ]
        }
      ]
    }
  ]
}

Create a complete 4-week program with home-appropriate exercises only.`;

    const gymWorkoutPrompt = `You are a certified personal trainer creating a GYM WORKOUT program. Generate exercises using full gym equipment.

USER PROFILE:
- Age: ${userData?.age} years old
- Gender: ${userData?.gender}
- Weight: ${userData?.weight}kg, Height: ${userData?.height}cm
- Fitness Goal: ${preferences?.goalType}
- Activity Level: ${userData?.activity_level}
- Fitness Level: ${preferences?.fitnessLevel}
- Available Time: ${preferences?.availableTime} minutes per session
- Health Conditions: ${userData?.health_conditions?.join(', ') || 'None'}

GYM WORKOUT REQUIREMENTS:
- Full access to gym equipment: barbells, dumbbells, machines, cables
- Progressive overload with proper weight training
- Compound and isolation movements
- 4-week progressive program with 4-5 workout days per week

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "programOverview": {
    "name": "Gym Training Program",
    "duration": "4 weeks",
    "difficulty": "${preferences?.fitnessLevel}",
    "description": "Complete gym workout program with progressive overload",
    "goals": ["${preferences?.goalType}", "strength_building"],
    "equipment": ["barbells", "dumbbells", "machines", "cables"]
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
          "estimatedDuration": ${preferences?.availableTime || 45},
          "estimatedCalories": 350,
          "muscleGroups": ["chest", "back", "shoulders", "arms"],
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 3,
              "reps": "8-10",
              "restSeconds": 90,
              "muscleGroups": ["chest", "triceps", "shoulders"],
              "instructions": "Lower bar to chest, press up explosively",
              "youtubeSearchTerm": "bench press proper form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "barbell",
              "orderNumber": 1
            },
            {
              "name": "Lat Pulldown",
              "sets": 3,
              "reps": "10-12",
              "restSeconds": 90,
              "muscleGroups": ["back", "biceps"],
              "instructions": "Pull bar down to chest, squeeze shoulder blades",
              "youtubeSearchTerm": "lat pulldown form",
              "difficulty": "${preferences?.fitnessLevel}",
              "equipment": "cable_machine",
              "orderNumber": 2
            }
          ]
        }
      ]
    }
  ]
}

Create a complete 4-week program with proper gym exercises.`;

    // Choose the appropriate prompt based on workout type
    const selectedPrompt = preferences?.workoutType === 'gym' ? gymWorkoutPrompt : homeWorkoutPrompt;
    
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

    // Store the program in the database
    const userId = userData?.userId;
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Create weekly program record
    const { data: weeklyProgram, error: weeklyError } = await supabase
      .from('weekly_exercise_programs')
      .insert({
        user_id: userId,
        program_name: generatedProgram.programOverview?.name || `${preferences?.workoutType || 'Home'} Fitness Program`,
        difficulty_level: preferences?.fitnessLevel || 'beginner',
        week_start_date: new Date().toISOString().split('T')[0],
        generation_prompt: {
          workoutType: preferences?.workoutType || 'home',
          preferences,
          userData
        }
      })
      .select()
      .single();

    if (weeklyError) {
      console.error('Error creating weekly program:', weeklyError);
      throw new Error('Failed to save weekly program');
    }

    // Store daily workouts and exercises
    for (const week of generatedProgram.weeks) {
      for (const workout of week.workouts) {
        // Create daily workout
        const { data: dailyWorkout, error: dailyError } = await supabase
          .from('daily_workouts')
          .insert({
            weekly_program_id: weeklyProgram.id,
            day_number: workout.day,
            workout_name: workout.workoutName,
            estimated_duration: workout.estimatedDuration,
            estimated_calories: workout.estimatedCalories,
            muscle_groups: workout.muscleGroups
          })
          .select()
          .single();

        if (dailyError) {
          console.error('Error creating daily workout:', dailyError);
          continue;
        }

        // Store exercises for this workout
        if (workout.exercises && Array.isArray(workout.exercises)) {
          const exercisesToInsert = workout.exercises.map(exercise => ({
            daily_workout_id: dailyWorkout.id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_seconds: exercise.restSeconds,
            muscle_groups: exercise.muscleGroups,
            instructions: exercise.instructions,
            youtube_search_term: exercise.youtubeSearchTerm,
            equipment: exercise.equipment,
            difficulty: exercise.difficulty,
            order_number: exercise.orderNumber || 1
          }));

          const { error: exerciseError } = await supabase
            .from('exercises')
            .insert(exercisesToInsert);

          if (exerciseError) {
            console.error('Error creating exercises:', exerciseError);
          }
        }
      }
    }

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
