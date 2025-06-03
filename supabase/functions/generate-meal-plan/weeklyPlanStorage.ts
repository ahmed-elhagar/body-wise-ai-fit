
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

export const saveWeeklyPlan = async (
  userProfile: any, 
  generatedPlan: any, 
  preferences: any, 
  adjustedDailyCalories: number
) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  console.log('💾 Saving weekly meal plan:', {
    userId: userProfile.id,
    weekOffset: preferences.weekOffset || 0,
    includeSnacks: preferences.includeSnacks,
    mealsPerDay: preferences.mealsPerDay || 3
  });

  // Calculate week start date based on offset
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (preferences.weekOffset || 0) * 7);
  const weekStartDate = startOfWeek.toISOString().split('T')[0];

  // Calculate totals from the generated plan
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (generatedPlan.days) {
    generatedPlan.days.forEach((day: any) => {
      if (day.meals) {
        day.meals.forEach((meal: any) => {
          totalCalories += meal.calories || 0;
          totalProtein += meal.protein || 0;
          totalCarbs += meal.carbs || 0;
          totalFat += meal.fat || 0;
        });
      }
    });
  }

  console.log('📊 Calculated totals:', {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    weekStartDate
  });

  // Check if a plan already exists for this week
  const { data: existingPlan, error: checkError } = await supabase
    .from('weekly_meal_plans')
    .select('id')
    .eq('user_id', userProfile.id)
    .eq('week_start_date', weekStartDate)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('❌ Error checking existing plan:', checkError);
    throw new Error(`Failed to check existing plan: ${checkError.message}`);
  }

  let weeklyPlan;

  if (existingPlan) {
    console.log('🔄 Updating existing weekly plan:', existingPlan.id);
    
    // Delete existing meals for this plan
    const { error: deleteError } = await supabase
      .from('daily_meals')
      .delete()
      .eq('weekly_plan_id', existingPlan.id);

    if (deleteError) {
      console.error('❌ Error deleting existing meals:', deleteError);
      throw new Error(`Failed to delete existing meals: ${deleteError.message}`);
    }

    // Update the weekly plan
    const { data: updatedPlan, error: updateError } = await supabase
      .from('weekly_meal_plans')
      .update({
        total_calories: totalCalories,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
        generation_prompt: preferences,
        life_phase_context: preferences.nutritionContext || {}
      })
      .eq('id', existingPlan.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating weekly plan:', updateError);
      throw new Error(`Failed to update weekly plan: ${updateError.message}`);
    }

    weeklyPlan = updatedPlan;
  } else {
    console.log('➕ Creating new weekly plan');
    
    // Create new weekly plan
    const { data: newPlan, error: insertError } = await supabase
      .from('weekly_meal_plans')
      .insert({
        user_id: userProfile.id,
        week_start_date: weekStartDate,
        total_calories: totalCalories,
        total_protein: totalProtein,
        total_carbs: totalCarbs,
        total_fat: totalFat,
        generation_prompt: preferences,
        life_phase_context: preferences.nutritionContext || {}
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error creating weekly plan:', insertError);
      throw new Error(`Failed to create weekly plan: ${insertError.message}`);
    }

    weeklyPlan = newPlan;
  }

  console.log('✅ Weekly plan saved successfully:', {
    id: weeklyPlan.id,
    weekStartDate: weeklyPlan.week_start_date,
    totalCalories: weeklyPlan.total_calories
  });

  return weeklyPlan;
};
