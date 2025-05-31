
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

    // Check for existing coach-trainee relationships to avoid duplicates
    const { data: existingRelationships } = await supabaseClient
      .from('coach_trainees')
      .select('coach_id, trainee_id')

    const existingPairs = new Set(
      existingRelationships?.map(rel => `${rel.coach_id}-${rel.trainee_id}`) || []
    )

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

    // Create coach-trainee relationships (only new ones)
    const newRelationships = []
    
    // Distribute trainees among coaches, avoiding duplicates
    trainees.forEach((trainee, index) => {
      const coachIndex = index % coaches.length
      const pairKey = `${coaches[coachIndex].id}-${trainee.id}`
      
      if (!existingPairs.has(pairKey)) {
        newRelationships.push({
          coach_id: coaches[coachIndex].id,
          trainee_id: trainee.id,
          notes: `Sample coaching relationship for ${trainee.first_name || 'trainee'}`
        })
      }
    })

    if (newRelationships.length > 0) {
      const { error: relationshipError } = await supabaseClient
        .from('coach_trainees')
        .insert(newRelationships)

      if (relationshipError) {
        console.error('Error creating coach-trainee relationships:', relationshipError)
        throw relationshipError
      }

      console.log('New coach-trainee relationships created:', newRelationships.length)
    } else {
      console.log('All coach-trainee relationships already exist')
    }

    // Create sample meal plans for trainees (check for existing ones first)
    const { data: existingMealPlans } = await supabaseClient
      .from('weekly_meal_plans')
      .select('user_id')
      .in('user_id', trainees.map(t => t.id))

    const existingMealPlanUsers = new Set(existingMealPlans?.map(mp => mp.user_id) || [])
    
    const mealPlans = trainees
      .filter(trainee => !existingMealPlanUsers.has(trainee.id))
      .map(trainee => ({
        user_id: trainee.id,
        week_start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        total_calories: 1600 + Math.floor(Math.random() * 400),
        total_protein: 120 + Math.floor(Math.random() * 30),
        total_carbs: 150 + Math.floor(Math.random() * 60),
        total_fat: 50 + Math.floor(Math.random() * 20)
      }))

    if (mealPlans.length > 0) {
      const { error: mealPlanError } = await supabaseClient
        .from('weekly_meal_plans')
        .insert(mealPlans)

      if (mealPlanError) {
        console.error('Error creating meal plans:', mealPlanError)
        throw mealPlanError
      }

      console.log('New meal plans created:', mealPlans.length)
    } else {
      console.log('All meal plans already exist')
    }

    // Create sample exercise programs for trainees (check for existing ones first)
    const { data: existingExercisePrograms } = await supabaseClient
      .from('weekly_exercise_programs')
      .select('user_id')
      .in('user_id', trainees.map(t => t.id))

    const existingExerciseProgramUsers = new Set(existingExercisePrograms?.map(ep => ep.user_id) || [])
    
    const exercisePrograms = trainees
      .filter(trainee => !existingExerciseProgramUsers.has(trainee.id))
      .map(trainee => ({
        user_id: trainee.id,
        program_name: 'Sample Fitness Program',
        difficulty_level: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
        workout_type: Math.random() > 0.5 ? 'home' : 'gym',
        current_week: 1,
        week_start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }))

    if (exercisePrograms.length > 0) {
      const { error: exerciseError } = await supabaseClient
        .from('weekly_exercise_programs')
        .insert(exercisePrograms)

      if (exerciseError) {
        console.error('Error creating exercise programs:', exerciseError)
        throw exerciseError
      }

      console.log('New exercise programs created:', exercisePrograms.length)
    } else {
      console.log('All exercise programs already exist')
    }

    // Create sample weight entries for trainees (check for existing ones first)
    const { data: existingWeightEntries } = await supabaseClient
      .from('weight_entries')
      .select('user_id')
      .in('user_id', trainees.map(t => t.id))

    const existingWeightEntryUsers = new Set(existingWeightEntries?.map(we => we.user_id) || [])
    
    const weightEntries = trainees
      .filter(trainee => !existingWeightEntryUsers.has(trainee.id))
      .flatMap(trainee => [
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

    if (weightEntries.length > 0) {
      const { error: weightError } = await supabaseClient
        .from('weight_entries')
        .insert(weightEntries)

      if (weightError) {
        console.error('Error creating weight entries:', weightError)
        throw weightError
      }

      console.log('New weight entries created:', weightEntries.length)
    } else {
      console.log('All weight entries already exist')
    }

    // Create sample goals for trainees (check for existing ones first)
    const { data: existingGoals } = await supabaseClient
      .from('user_goals')
      .select('user_id')
      .in('user_id', trainees.map(t => t.id))

    const existingGoalUsers = new Set(existingGoals?.map(g => g.user_id) || [])
    
    const goals = trainees
      .filter(trainee => !existingGoalUsers.has(trainee.id))
      .map(trainee => ({
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

    if (goals.length > 0) {
      const { error: goalsError } = await supabaseClient
        .from('user_goals')
        .insert(goals)

      if (goalsError) {
        console.error('Error creating goals:', goalsError)
        throw goalsError
      }

      console.log('New goals created:', goals.length)
    } else {
      console.log('All goals already exist')
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sample coach-trainee data created successfully using existing users',
        data: {
          coaches: coaches.length,
          trainees: trainees.length,
          newRelationships: newRelationships.length,
          newMealPlans: mealPlans.length,
          newExercisePrograms: exercisePrograms.length,
          newWeightEntries: weightEntries.length / 2, // Divided by 2 since we create 2 per user
          newGoals: goals.length
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
