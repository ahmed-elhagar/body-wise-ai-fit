
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { weeklyPlanId, userId } = await req.json();

    console.log('🔄 Starting meal shuffle for weekly plan:', weeklyPlanId, 'user:', userId);

    // Verify the user owns this weekly plan with detailed logging
    const { data: weeklyPlan, error: planError } = await supabaseClient
      .from('weekly_meal_plans')
      .select('id, user_id, week_start_date')
      .eq('id', weeklyPlanId)
      .eq('user_id', userId)
      .single();

    console.log('📋 Weekly plan lookup result:', {
      weeklyPlan,
      planError,
      searchedId: weeklyPlanId,
      searchedUserId: userId
    });

    if (planError) {
      console.error('❌ Weekly plan query error:', planError);
      throw new Error(`Weekly plan query failed: ${planError.message}`);
    }

    if (!weeklyPlan) {
      console.error('❌ Weekly plan not found or access denied for:', {
        weeklyPlanId,
        userId
      });
      throw new Error('Weekly plan not found or access denied');
    }

    console.log('✅ Weekly plan verified:', weeklyPlan);

    // Get current meals for the week
    const { data: currentMeals, error: fetchError } = await supabaseClient
      .from('daily_meals')
      .select('*')
      .eq('weekly_plan_id', weeklyPlanId)
      .order('day_number', { ascending: true })
      .order('meal_type', { ascending: true });

    console.log('🍽️ Fetched meals:', {
      mealsCount: currentMeals?.length || 0,
      fetchError,
      weeklyPlanId
    });

    if (fetchError) {
      console.error('❌ Error fetching meals:', fetchError);
      throw new Error(`Failed to fetch meals: ${fetchError.message}`);
    }

    if (!currentMeals || currentMeals.length === 0) {
      console.error('❌ No meals found for weekly plan:', weeklyPlanId);
      throw new Error('No meals found to shuffle');
    }

    // Group meals by type (breakfast, lunch, dinner, snack)
    const mealsByType = currentMeals.reduce((acc, meal) => {
      // Normalize snack types to just "snack"
      let mealType = meal.meal_type;
      if (mealType.startsWith('snack') || meal.name.includes('🍎')) {
        mealType = 'snack';
      }
      
      if (!acc[mealType]) {
        acc[mealType] = [];
      }
      acc[mealType].push(meal);
      return acc;
    }, {});

    console.log('📊 Grouped meals by type:', Object.keys(mealsByType).map(type => ({
      type,
      count: mealsByType[type].length
    })));

    // Shuffle function
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Shuffle each meal type and reassign to days
    const shuffledMeals = [];
    const daysInWeek = [1, 2, 3, 4, 5, 6, 7];

    Object.keys(mealsByType).forEach(mealType => {
      const mealsOfType = mealsByType[mealType];
      
      if (mealType === 'snack') {
        // Handle snacks separately - maintain structure but shuffle content
        const snacksByDay = {};
        mealsOfType.forEach(meal => {
          if (!snacksByDay[meal.day_number]) {
            snacksByDay[meal.day_number] = [];
          }
          snacksByDay[meal.day_number].push(meal);
        });
        
        // Get all snacks and shuffle them
        const allSnacks = Object.values(snacksByDay).flat();
        const shuffledSnacks = shuffleArray(allSnacks);
        
        // Redistribute shuffled snacks maintaining the same structure
        let snackIndex = 0;
        Object.keys(snacksByDay).forEach(dayNum => {
          const daySnacks = snacksByDay[dayNum];
          daySnacks.forEach((originalSnack, index) => {
            if (shuffledSnacks[snackIndex]) {
              shuffledMeals.push({
                ...shuffledSnacks[snackIndex],
                day_number: parseInt(dayNum),
                meal_type: originalSnack.meal_type // Keep original meal_type (snack1, snack2, etc.)
              });
              snackIndex++;
            }
          });
        });
      } else {
        // For other meal types, shuffle and assign one per day
        const shuffledMealsOfType = shuffleArray(mealsOfType);
        daysInWeek.forEach((dayNumber, index) => {
          if (shuffledMealsOfType[index]) {
            shuffledMeals.push({
              ...shuffledMealsOfType[index],
              day_number: dayNumber
            });
          }
        });
      }
    });

    console.log(`🔄 Preparing to shuffle ${shuffledMeals.length} meals across 7 days`);

    // Update meals in database with batch operations
    const updatePromises = shuffledMeals.map(meal => {
      console.log(`🔄 Updating meal ${meal.id}: ${meal.name} to day ${meal.day_number}`);
      return supabaseClient
        .from('daily_meals')
        .update({ 
          day_number: meal.day_number,
          meal_type: meal.meal_type
        })
        .eq('id', meal.id);
    });

    const results = await Promise.all(updatePromises);
    
    // Check for errors
    const hasErrors = results.some(result => result.error);
    if (hasErrors) {
      const errors = results.filter(r => r.error).map(r => r.error);
      console.error('❌ Some updates failed:', errors);
      throw new Error('Failed to update some meals during shuffle');
    }

    console.log('✅ All meals shuffled successfully');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Meals shuffled successfully!',
      shuffledCount: shuffledMeals.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Meal shuffle failed:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'Failed to shuffle meals'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
