
import { supabase } from '@/integrations/supabase/client';
import type { MealPlanFetchResult } from '../types';

export const fetchMealPlanData = async (
  userId: string, 
  weekStartDateStr: string
): Promise<MealPlanFetchResult | null> => {
  console.log('🔍 Fetching meal plan data for:', {
    userId: userId.substring(0, 8) + '...',
    weekStartDate: weekStartDateStr
  });

  // Fetch weekly meal plan
  const { data: weeklyPlan, error: weeklyError } = await supabase
    .from('weekly_meal_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDateStr)
    .maybeSingle();

  if (weeklyError) {
    console.error('❌ Error fetching weekly meal plan:', weeklyError);
    throw weeklyError;
  }

  if (!weeklyPlan) {
    console.log('📋 No weekly meal plan found for this week');
    return null;
  }

  // Fetch daily meals for this weekly plan
  const { data: dailyMeals, error: mealsError } = await supabase
    .from('daily_meals')
    .select('*')
    .eq('weekly_plan_id', weeklyPlan.id)
    .order('day_number', { ascending: true });

  if (mealsError) {
    console.error('❌ Error fetching daily meals:', mealsError);
    throw mealsError;
  }

  console.log('✅ Meal plan data fetched successfully:', {
    weeklyPlanId: weeklyPlan.id,
    dailyMealsCount: dailyMeals?.length || 0
  });

  return {
    weeklyPlan,
    dailyMeals: dailyMeals || []
  };
};
