
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Creating sample coach-trainee data...')

    // Try different common fitness goal values that might be valid
    // Start with the most basic ones that are likely to exist
    const possibleFitnessGoals = ['weight_loss', 'muscle_gain', 'general_fitness', 'strength', 'endurance']
    let validFitnessGoal = 'weight_loss' // Default fallback

    // Try to find an existing profile to see what fitness_goal values work
    const { data: existingProfile } = await supabaseClient
      .from('profiles')
      .select('fitness_goal')
      .not('fitness_goal', 'is', null)
      .limit(1)
      .single()

    if (existingProfile?.fitness_goal) {
      validFitnessGoal = existingProfile.fitness_goal
      console.log('Found existing fitness goal:', validFitnessGoal)
    }

    // Create sample coaches with minimal required fields first
    const sampleCoaches = [
      {
        id: crypto.randomUUID(),
        email: 'coach1@fitgenius.com',
        first_name: 'Sarah',
        last_name: 'Johnson',
        role: 'coach',
        ai_generations_remaining: 10,
        age: 32,
        gender: 'female',
        weight: 65,
        height: 168,
        activity_level: 'very_active',
        onboarding_completed: true,
        profile_completion_score: 95
      },
      {
        id: crypto.randomUUID(),
        email: 'coach2@fitgenius.com',
        first_name: 'Mike',
        last_name: 'Rodriguez',
        role: 'coach',
        ai_generations_remaining: 10,
        age: 28,
        gender: 'male',
        weight: 78,
        height: 180,
        activity_level: 'very_active',
        onboarding_completed: true,
        profile_completion_score: 98
      }
    ]

    // Create sample trainees with minimal required fields first
    const sampleTrainees = [
      {
        id: crypto.randomUUID(),
        email: 'trainee1@fitgenius.com',
        first_name: 'Emma',
        last_name: 'Davis',
        role: 'normal',
        ai_generations_remaining: 5,
        age: 25,
        gender: 'female',
        weight: 60,
        height: 165,
        activity_level: 'moderately_active',
        onboarding_completed: true,
        profile_completion_score: 87
      },
      {
        id: crypto.randomUUID(),
        email: 'trainee2@fitgenius.com',
        first_name: 'James',
        last_name: 'Wilson',
        role: 'normal',
        ai_generations_remaining: 5,
        age: 30,
        gender: 'male',
        weight: 85,
        height: 175,
        activity_level: 'lightly_active',
        onboarding_completed: true,
        profile_completion_score: 92
      },
      {
        id: crypto.randomUUID(),
        email: 'trainee3@fitgenius.com',
        first_name: 'Lisa',
        last_name: 'Brown',
        role: 'normal',
        ai_generations_remaining: 5,
        age: 27,
        gender: 'female',
        weight: 55,
        height: 160,
        activity_level: 'moderately_active',
        onboarding_completed: true,
        profile_completion_score: 89
      },
      {
        id: crypto.randomUUID(),
        email: 'trainee4@fitgenius.com',
        first_name: 'David',
        last_name: 'Taylor',
        role: 'normal',
        ai_generations_remaining: 5,
        age: 35,
        gender: 'male',
        weight: 90,
        height: 185,
        activity_level: 'lightly_active',
        onboarding_completed: true,
        profile_completion_score: 84
      },
      {
        id: crypto.randomUUID(),
        email: 'trainee5@fitgenius.com',
        first_name: 'Anna',
        last_name: 'Martinez',
        role: 'normal',
        ai_generations_remaining: 5,
        age: 22,
        gender: 'female',
        weight: 58,
        height: 162,
        activity_level: 'moderately_active',
        onboarding_completed: true,
        profile_completion_score: 91
      }
    ]

    // Insert coaches first without fitness_goal
    const { data: insertedCoaches, error: coachError } = await supabaseClient
      .from('profiles')
      .insert(sampleCoaches)
      .select()

    if (coachError) {
      console.error('Error inserting coaches:', coachError)
      throw coachError
    }

    console.log('Coaches inserted successfully:', insertedCoaches?.length)

    // Insert trainees without fitness_goal
    const { data: insertedTrainees, error: traineeError } = await supabaseClient
      .from('profiles')
      .insert(sampleTrainees)
      .select()

    if (traineeError) {
      console.error('Error inserting trainees:', traineeError)
      throw traineeError
    }

    console.log('Trainees inserted successfully:', insertedTrainees?.length)

    // Now try to update with fitness_goal if we can find a valid value
    if (validFitnessGoal) {
      console.log('Attempting to set fitness goals...')
      
      for (const coach of sampleCoaches) {
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ fitness_goal: validFitnessGoal })
          .eq('id', coach.id)
        
        if (updateError) {
          console.log('Could not set fitness_goal, skipping:', updateError.message)
          break
        }
      }

      for (const trainee of sampleTrainees) {
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ fitness_goal: validFitnessGoal })
          .eq('id', trainee.id)
        
        if (updateError) {
          console.log('Could not set fitness_goal, skipping:', updateError.message)
          break
        }
      }
    }

    // Create coach-trainee relationships
    const relationships = [
      // Sarah Johnson's trainees
      {
        coach_id: sampleCoaches[0].id,
        trainee_id: sampleTrainees[0].id, // Emma
        notes: 'Focused on weight loss journey. Very motivated and consistent with workouts.'
      },
      {
        coach_id: sampleCoaches[0].id,
        trainee_id: sampleTrainees[1].id, // James
        notes: 'Looking to build muscle mass. Needs guidance on proper form and nutrition.'
      },
      {
        coach_id: sampleCoaches[0].id,
        trainee_id: sampleTrainees[2].id, // Lisa
        notes: 'Maintaining current fitness level. Enjoys variety in workout routines.'
      },
      // Mike Rodriguez's trainees
      {
        coach_id: sampleCoaches[1].id,
        trainee_id: sampleTrainees[3].id, // David
        notes: 'New to fitness. Starting with basic movements and building confidence.'
      },
      {
        coach_id: sampleCoaches[1].id,
        trainee_id: sampleTrainees[4].id, // Anna
        notes: 'Athletic background. Ready for more advanced training techniques.'
      }
    ]

    const { error: relationshipError } = await supabaseClient
      .from('coach_trainees')
      .insert(relationships)

    if (relationshipError) {
      console.error('Error creating coach-trainee relationships:', relationshipError)
      throw relationshipError
    }

    console.log('Coach-trainee relationships created successfully')

    // Create sample meal plans for trainees
    const mealPlans = sampleTrainees.map(trainee => ({
      user_id: trainee.id,
      week_start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_calories: 1800,
      total_protein: 135,
      total_carbs: 180,
      total_fat: 60
    }))

    const { error: mealPlanError } = await supabaseClient
      .from('weekly_meal_plans')
      .insert(mealPlans)

    if (mealPlanError) {
      console.error('Error creating meal plans:', mealPlanError)
      throw mealPlanError
    }

    console.log('Meal plans created successfully')

    // Create sample exercise programs for trainees
    const exercisePrograms = sampleTrainees.map(trainee => ({
      user_id: trainee.id,
      program_name: 'General Fitness Program',
      difficulty_level: trainee.activity_level === 'lightly_active' ? 'beginner' :
                        trainee.activity_level === 'moderately_active' ? 'intermediate' : 'advanced',
      workout_type: 'home',
      current_week: 1,
      week_start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))

    const { error: exerciseError } = await supabaseClient
      .from('weekly_exercise_programs')
      .insert(exercisePrograms)

    if (exerciseError) {
      console.error('Error creating exercise programs:', exerciseError)
      throw exerciseError
    }

    console.log('Exercise programs created successfully')

    // Create sample weight entries for trainees
    const weightEntries = sampleTrainees.flatMap(trainee => [
      {
        user_id: trainee.id,
        weight: trainee.weight - Math.random() * 2,
        recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Weekly check-in with coach'
      },
      {
        user_id: trainee.id,
        weight: trainee.weight - Math.random() * 1.5,
        recorded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Progress tracking'
      }
    ])

    const { error: weightError } = await supabaseClient
      .from('weight_entries')
      .insert(weightEntries)

    if (weightError) {
      console.error('Error creating weight entries:', weightError)
      throw weightError
    }

    console.log('Weight entries created successfully')

    // Create sample goals for trainees
    const goals = sampleTrainees.map(trainee => ({
      user_id: trainee.id,
      category: 'fitness',
      goal_type: 'weight',
      title: 'Achieve fitness goals',
      description: 'Working with coach to achieve fitness goals',
      target_value: trainee.weight,
      current_value: trainee.weight,
      target_unit: 'kg',
      status: 'active',
      priority: 'high',
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      target_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))

    const { error: goalsError } = await supabaseClient
      .from('user_goals')
      .insert(goals)

    if (goalsError) {
      console.error('Error creating goals:', goalsError)
      throw goalsError
    }

    console.log('Goals created successfully')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sample data created successfully',
        data: {
          coaches: insertedCoaches?.length || 0,
          trainees: insertedTrainees?.length || 0,
          relationships: relationships.length,
          mealPlans: mealPlans.length,
          exercisePrograms: exercisePrograms.length,
          weightEntries: weightEntries.length,
          goals: goals.length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error creating sample data:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: error
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
