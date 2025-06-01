
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import type { WeeklyMealPlan, MealPlanFetchResult } from './types';
import { processMealData } from './mealPlanUtils';

export const fetchMealPlanData = async (userId: string, weekStartDateStr: string): Promise<MealPlanFetchResult | null> => {
  console.log('🎯 MEAL PLAN FETCH:', {
    userId: userId.substring(0, 8) + '...',
    searchingForDate: weekStartDateStr
  });

  // Fetch weekly plan
  const { data: weeklyPlan, error: weeklyError } = await supabase
    .from('weekly_meal_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDateStr)
    .maybeSingle();

  if (weeklyError) {
    console.error('❌ Error fetching weekly plan:', weeklyError);
    throw weeklyError;
  }

  if (!weeklyPlan) {
    console.log('❌ NO MEAL PLAN FOUND for week:', weekStartDateStr);
    return null;
  }

  // Fetch meals for the plan
  const { data: dailyMeals, error: mealsError } = await supabase
    .from('daily_meals')
    .select('*')
    .eq('weekly_plan_id', weeklyPlan.id)
    .order('day_number', { ascending: true })
    .order('meal_type', { ascending: true });

  if (mealsError) {
    console.error('❌ Error fetching daily meals:', mealsError);
    throw mealsError;
  }

  console.log('✅ Found meals for week:', {
    planId: weeklyPlan.id,
    mealsCount: dailyMeals?.length || 0,
    weekStartDate: weeklyPlan.week_start_date
  });

  // Process meals data with safe JSON parsing
  const processedMeals = (dailyMeals || []).map(processMealData);

  return {
    weeklyPlan: {
      id: weeklyPlan.id,
      user_id: weeklyPlan.user_id,
      week_start_date: weeklyPlan.week_start_date,
      total_calories: weeklyPlan.total_calories || 0,
      total_protein: weeklyPlan.total_protein || 0,
      total_carbs: weeklyPlan.total_carbs || 0,
      total_fat: weeklyPlan.total_fat || 0,
      generation_prompt: weeklyPlan.generation_prompt,
      created_at: weeklyPlan.created_at,
      life_phase_context: weeklyPlan.life_phase_context
    } as WeeklyMealPlan,
    dailyMeals: processedMeals
  };
};
