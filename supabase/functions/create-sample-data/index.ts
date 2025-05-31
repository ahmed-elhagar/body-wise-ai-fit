
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

    // Get existing users from the database to use as sample data
    const { data: existingProfiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, role, first_name, last_name, email')
      .limit(10)

    if (profilesError) {
      console.error('Error fetching existing profiles:', profilesError)
      throw profilesError
    }

    if (!existingProfiles || existingProfiles.length < 2) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Not enough existing users to create sample data. Please create at least 2 user accounts first.',
          suggestion: 'Create some user accounts through the authentication system first, then try again.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Use existing users for our sample data
    const users = existingProfiles.slice(0, 7) // Take up to 7 users
    
    // Assign roles: first 2 as coaches, rest as trainees
    const coaches = users.slice(0, 2)
    const trainees = users.slice(2, 7)

    if (trainees.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Need at least 3 users total (2 coaches + 1 trainee minimum)',
          suggestion: 'Create more user accounts through the authentication system first.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Update the selected users to have coach/trainee roles and complete profile data
    const coachUpdates = coaches.map(coach => ({
      id: coach.id,
      role: 'coach',
      ai_generations_remaining: 10,
      age: 30 + Math.floor(Math.random() * 10),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      weight: 60 + Math.floor(Math.random() * 30),
      height: 160 + Math.floor(Math.random() * 25),
      activity_level: 'very_active',
      onboarding_completed: true,
      profile_completion_score: 95 + Math.floor(Math.random() * 5),
      first_name: coach.first_name || `Coach${Math.floor(Math.random() * 100)}`,
      last_name: coach.last_name || 'Sample'
    }))

    const traineeUpdates = trainees.map(trainee => ({
      id: trainee.id,
      role: 'normal',
      ai_generations_remaining: 5,
      age: 20 + Math.floor(Math.random() * 20),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      weight: 50 + Math.floor(Math.random() * 40),
      height: 155 + Math.floor(Math.random() * 30),
      activity_level: ['lightly_active', 'moderately_active', 'very_active'][Math.floor(Math.random() * 3)],
      onboarding_completed: true,
      profile_completion_score: 80 + Math.floor(Math.random() * 15),
      first_name: trainee.first_name || `Trainee${Math.floor(Math.random() * 100)}`,
      last_name: trainee.last_name || 'Sample'
    }))

    // Update coaches
    for (const coach of coachUpdates) {
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update(coach)
        .eq('id', coach.id)
      
      if (updateError) {
        console.error('Error updating coach:', updateError)
        throw updateError
      }
    }

    console.log('Updated coaches successfully:', coachUpdates.length)

    // Update trainees
    for (const trainee of traineeUpdates) {
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update(trainee)
        .eq('id', trainee.id)
      
      if (updateError) {
        console.error('Error updating trainee:', updateError)
        throw updateError
      }
    }

    console.log('Updated trainees successfully:', traineeUpdates.length)

    // Create coach-trainee relationships
    const relationships = []
    
    // Distribute trainees among coaches
    trainees.forEach((trainee, index) => {
      const coachIndex = index % coaches.length
      relationships.push({
        coach_id: coaches[coachIndex].id,
        trainee_id: trainee.id,
        notes: `Sample coaching relationship for ${trainee.first_name || 'trainee'}`
      })
    })

    const { error: relationshipError } = await supabaseClient
      .from('coach_trainees')
      .insert(relationships)

    if (relationshipError) {
      console.error('Error creating coach-trainee relationships:', relationshipError)
      throw relationshipError
    }

    console.log('Coach-trainee relationships created successfully')

    // Create sample meal plans for trainees
    const mealPlans = trainees.map(trainee => ({
      user_id: trainee.id,
      week_start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_calories: 1600 + Math.floor(Math.random() * 400),
      total_protein: 120 + Math.floor(Math.random() * 30),
      total_carbs: 150 + Math.floor(Math.random() * 60),
      total_fat: 50 + Math.floor(Math.random() * 20)
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
    const exercisePrograms = trainees.map(trainee => ({
      user_id: trainee.id,
      program_name: 'Sample Fitness Program',
      difficulty_level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
      workout_type: Math.random() > 0.5 ? 'home' : 'gym',
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
    const weightEntries = trainees.flatMap(trainee => [
      {
        user_id: trainee.id,
        weight: (traineeUpdates.find(t => t.id === trainee.id)?.weight || 70) - Math.random() * 2,
        recorded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Weekly check-in'
      },
      {
        user_id: trainee.id,
        weight: (traineeUpdates.find(t => t.id === trainee.id)?.weight || 70) - Math.random() * 1.5,
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
    const goals = trainees.map(trainee => ({
      user_id: trainee.id,
      category: 'fitness',
      goal_type: 'weight',
      title: 'Sample Fitness Goal',
      description: 'Working with coach to achieve fitness goals',
      target_value: (traineeUpdates.find(t => t.id === trainee.id)?.weight || 70) - 5,
      current_value: traineeUpdates.find(t => t.id === trainee.id)?.weight || 70,
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
        message: 'Sample coach-trainee data created successfully using existing users',
        data: {
          coaches: coaches.length,
          trainees: trainees.length,
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
