
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { userData, preferences, userLanguage = 'en', weekOffset = 0 } = await req.json()

    console.log('🏋️ Starting exercise program generation:', {
      userId: userData?.userId?.substring(0, 8) + '...',
      workoutType: preferences?.workoutType,
      weekOffset
    })

    // For now, create a mock exercise program
    const mockProgram = {
      program_name: `${preferences?.workoutType === 'gym' ? 'Gym' : 'Home'} Fitness Program`,
      difficulty_level: preferences?.fitnessLevel || 'beginner',
      workout_type: preferences?.workoutType || 'home',
      current_week: 1,
      week_start_date: preferences?.weekStartDate || new Date().toISOString().split('T')[0],
      daily_workouts: [
        {
          day_number: 1,
          workout_name: 'Upper Body Strength',
          is_rest_day: false,
          muscle_groups: ['chest', 'shoulders', 'arms'],
          estimated_duration: parseInt(preferences?.availableTime || '45'),
          exercises: [
            {
              name: preferences?.workoutType === 'gym' ? 'Bench Press' : 'Push-ups',
              sets: 3,
              reps: '8-12',
              muscle_groups: ['chest', 'shoulders'],
              equipment: preferences?.workoutType === 'gym' ? 'barbell' : 'bodyweight',
              instructions: preferences?.workoutType === 'gym' 
                ? 'Lie on bench, grip bar wider than shoulders, press up and control down'
                : 'Start in plank position, lower chest to floor, push back up',
              rest_seconds: 60
            },
            {
              name: preferences?.workoutType === 'gym' ? 'Shoulder Press' : 'Pike Push-ups',
              sets: 3,
              reps: '8-12',
              muscle_groups: ['shoulders'],
              equipment: preferences?.workoutType === 'gym' ? 'dumbbells' : 'bodyweight',
              instructions: preferences?.workoutType === 'gym'
                ? 'Press dumbbells overhead, control the weight down'
                : 'In downward dog position, lower head toward ground, press back up',
              rest_seconds: 60
            }
          ]
        },
        {
          day_number: 2,
          workout_name: 'Lower Body Power',
          is_rest_day: false,
          muscle_groups: ['legs', 'glutes'],
          estimated_duration: parseInt(preferences?.availableTime || '45'),
          exercises: [
            {
              name: preferences?.workoutType === 'gym' ? 'Squats' : 'Bodyweight Squats',
              sets: 3,
              reps: '12-15',
              muscle_groups: ['legs', 'glutes'],
              equipment: preferences?.workoutType === 'gym' ? 'barbell' : 'bodyweight',
              instructions: 'Lower into squat position, keeping chest up, drive through heels to stand',
              rest_seconds: 90
            }
          ]
        },
        {
          day_number: 3,
          workout_name: 'Rest Day',
          is_rest_day: true,
          muscle_groups: [],
          estimated_duration: 0,
          exercises: []
        },
        {
          day_number: 4,
          workout_name: 'Core & Cardio',
          is_rest_day: false,
          muscle_groups: ['core'],
          estimated_duration: parseInt(preferences?.availableTime || '45'),
          exercises: [
            {
              name: 'Plank',
              sets: 3,
              reps: '30-60 seconds',
              muscle_groups: ['core'],
              equipment: 'bodyweight',
              instructions: 'Hold plank position, keep body straight from head to heels',
              rest_seconds: 60
            }
          ]
        },
        {
          day_number: 5,
          workout_name: 'Full Body',
          is_rest_day: false,
          muscle_groups: ['full_body'],
          estimated_duration: parseInt(preferences?.availableTime || '45'),
          exercises: [
            {
              name: preferences?.workoutType === 'gym' ? 'Deadlifts' : 'Burpees',
              sets: 3,
              reps: preferences?.workoutType === 'gym' ? '6-8' : '8-12',
              muscle_groups: ['full_body'],
              equipment: preferences?.workoutType === 'gym' ? 'barbell' : 'bodyweight',
              instructions: preferences?.workoutType === 'gym'
                ? 'Lift bar from ground, keep back straight, drive hips forward'
                : 'Drop to plank, jump feet to hands, jump up with arms overhead',
              rest_seconds: 120
            }
          ]
        },
        {
          day_number: 6,
          workout_name: 'Active Recovery',
          is_rest_day: false,
          muscle_groups: ['mobility'],
          estimated_duration: 30,
          exercises: [
            {
              name: 'Stretching',
              sets: 1,
              reps: '10-15 minutes',
              muscle_groups: ['full_body'],
              equipment: 'none',
              instructions: 'Light stretching and mobility work',
              rest_seconds: 0
            }
          ]
        },
        {
          day_number: 7,
          workout_name: 'Rest Day',
          is_rest_day: true,
          muscle_groups: [],
          estimated_duration: 0,
          exercises: []
        }
      ]
    }

    // Save to database
    const { data: program, error: programError } = await supabase
      .from('weekly_exercise_programs')
      .insert({
        user_id: userData.userId,
        program_name: mockProgram.program_name,
        difficulty_level: mockProgram.difficulty_level,
        workout_type: mockProgram.workout_type,
        current_week: mockProgram.current_week,
        week_start_date: mockProgram.week_start_date,
        generation_prompt: preferences
      })
      .select()
      .single()

    if (programError) {
      console.error('❌ Error saving program:', programError)
      throw programError
    }

    // Save daily workouts
    for (const workout of mockProgram.daily_workouts) {
      const { data: dailyWorkout, error: workoutError } = await supabase
        .from('daily_workouts')
        .insert({
          weekly_program_id: program.id,
          day_number: workout.day_number,
          workout_name: workout.workout_name,
          is_rest_day: workout.is_rest_day,
          muscle_groups: workout.muscle_groups,
          estimated_duration: workout.estimated_duration,
          estimated_calories: workout.estimated_duration * 8 // rough estimate
        })
        .select()
        .single()

      if (workoutError) {
        console.error('❌ Error saving workout:', workoutError)
        continue
      }

      // Save exercises for non-rest days
      if (!workout.is_rest_day && workout.exercises) {
        for (const [index, exercise] of workout.exercises.entries()) {
          const { error: exerciseError } = await supabase
            .from('exercises')
            .insert({
              daily_workout_id: dailyWorkout.id,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              muscle_groups: exercise.muscle_groups,
              equipment: exercise.equipment,
              instructions: exercise.instructions,
              rest_seconds: exercise.rest_seconds,
              order_number: index + 1
            })

          if (exerciseError) {
            console.error('❌ Error saving exercise:', exerciseError)
          }
        }
      }
    }

    console.log('✅ Exercise program generated successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        program_id: program.id,
        message: 'Exercise program generated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error generating exercise program:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to generate exercise program'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
