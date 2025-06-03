
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { weeklyPlanId, userId } = await req.json()

    console.log('🔄 Starting meal shuffle for weekly plan:', weeklyPlanId, 'user:', userId)

    // Verify weekly plan exists and belongs to user
    const { data: weeklyPlan, error: planError } = await supabase
      .from('weekly_meal_plans')
      .select('*')
      .eq('id', weeklyPlanId)
      .eq('user_id', userId)
      .single()

    console.log('📋 Weekly plan lookup result:', {
      weeklyPlan: weeklyPlan ? { 
        id: weeklyPlan.id, 
        user_id: weeklyPlan.user_id, 
        week_start_date: weeklyPlan.week_start_date 
      } : null,
      planError,
      searchedId: weeklyPlanId,
      searchedUserId: userId
    })

    if (planError || !weeklyPlan) {
      console.error('❌ Weekly plan not found or access denied:', planError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Weekly plan not found or access denied',
          details: planError?.message 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Weekly plan verified:', {
      id: weeklyPlan.id,
      user_id: weeklyPlan.user_id,
      week_start_date: weeklyPlan.week_start_date
    })

    // Fetch all meals for this weekly plan
    const { data: meals, error: fetchError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('weekly_plan_id', weeklyPlanId)
      .order('day_number', { ascending: true })

    console.log('🍽️ Fetched meals:', {
      mealsCount: meals?.length || 0,
      fetchError,
      weeklyPlanId
    })

    if (fetchError || !meals || meals.length === 0) {
      console.error('❌ No meals found for weekly plan:', fetchError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No meals found for this weekly plan',
          details: fetchError?.message 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Group meals by type for balanced distribution
    const mealsByType = meals.reduce((acc, meal) => {
      if (!acc[meal.meal_type]) {
        acc[meal.meal_type] = []
      }
      acc[meal.meal_type].push(meal)
      return acc
    }, {} as Record<string, any[]>)

    console.log('📊 Grouped meals by type:', 
      Object.entries(mealsByType).map(([type, meals]) => ({ type, count: meals.length }))
    )

    console.log('🔄 Preparing to shuffle', meals.length, 'meals across 7 days')

    // Shuffle and redistribute meals with optimized batch processing
    const shufflePromises = []
    const BATCH_SIZE = 5 // Process 5 meals at a time to avoid timeouts
    
    for (const [mealType, typeMeals] of Object.entries(mealsByType)) {
      // Shuffle meals of this type
      const shuffled = [...typeMeals].sort(() => Math.random() - 0.5)
      
      // Distribute across days (1-7)
      for (let i = 0; i < shuffled.length; i++) {
        const meal = shuffled[i]
        const newDayNumber = (i % 7) + 1
        
        if (meal.day_number !== newDayNumber) {
          console.log(`🔄 Updating meal ${meal.id}: ${meal.name} to day ${newDayNumber}`)
          
          const updatePromise = supabase
            .from('daily_meals')
            .update({ day_number: newDayNumber })
            .eq('id', meal.id)
            .eq('weekly_plan_id', weeklyPlanId) // Security: ensure meal belongs to this plan
          
          shufflePromises.push(updatePromise)
          
          // Process in batches to avoid overwhelming the database
          if (shufflePromises.length >= BATCH_SIZE) {
            try {
              const batchResults = await Promise.all(shufflePromises)
              const errors = batchResults.filter(result => result.error)
              if (errors.length > 0) {
                console.error('❌ Batch update errors:', errors.map(e => e.error))
              }
              shufflePromises.length = 0 // Clear the batch
              
              // Small delay between batches to prevent overwhelming DB
              await new Promise(resolve => setTimeout(resolve, 100))
            } catch (batchError) {
              console.error('❌ Batch processing error:', batchError)
            }
          }
        }
      }
    }

    // Process remaining meals in final batch
    if (shufflePromises.length > 0) {
      try {
        const finalResults = await Promise.all(shufflePromises)
        const finalErrors = finalResults.filter(result => result.error)
        if (finalErrors.length > 0) {
          console.error('❌ Final batch update errors:', finalErrors.map(e => e.error))
        }
      } catch (finalError) {
        console.error('❌ Final batch processing error:', finalError)
      }
    }

    console.log('✅ Meal shuffle completed successfully!')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Meals shuffled successfully!',
        shuffledCount: meals.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Meal shuffle failed:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to shuffle meals' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
