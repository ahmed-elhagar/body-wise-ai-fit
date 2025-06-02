
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

  // Helper function to safely parse JSON data
  const safeJsonParse = (value: any, fallback: any = []) => {
    if (!value) return fallback;
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    }
    return fallback;
  };

  // Process and map the data to match our types
  const processedWeeklyPlan = {
    id: weeklyPlan.id,
    user_id: weeklyPlan.user_id,
    week_start_date: weeklyPlan.week_start_date,
    total_calories: weeklyPlan.total_calories || 0,
    total_protein: weeklyPlan.total_protein || 0,
    total_carbs: weeklyPlan.total_carbs || 0,
    total_fat: weeklyPlan.total_fat || 0,
    preferences: weeklyPlan.generation_prompt || {},
    created_at: weeklyPlan.created_at,
    updated_at: weeklyPlan.created_at, // Use created_at as fallback for updated_at
    life_phase_context: weeklyPlan.life_phase_context
  };

  // Process daily meals with proper type mapping
  const processedDailyMeals = (dailyMeals || []).map(meal => ({
    id: meal.id,
    weekly_plan_id: meal.weekly_plan_id,
    day_number: meal.day_number,
    meal_type: meal.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2',
    name: meal.name,
    calories: meal.calories || 0,
    protein: meal.protein || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0,
    fiber: meal.fiber || 0, // Provide default value if missing
    sugar: meal.sugar || 0, // Provide default value if missing
    prep_time: meal.prep_time || 0,
    cook_time: meal.cook_time || 0,
    servings: meal.servings || 1,
    youtube_search_term: meal.youtube_search_term,
    image_url: meal.image_url,
    recipe_fetched: meal.recipe_fetched || false,
    ingredients: safeJsonParse(meal.ingredients, []).map((ing: any) => ({
      name: typeof ing === 'string' ? ing : ing.name || 'Unknown ingredient',
      quantity: typeof ing === 'string' ? '1' : ing.quantity || '1',
      unit: typeof ing === 'string' ? 'piece' : ing.unit || 'piece'
    })),
    instructions: safeJsonParse(meal.instructions, []).map((inst: any) => 
      typeof inst === 'string' ? inst : String(inst)
    ),
    alternatives: safeJsonParse(meal.alternatives, []).map((alt: any) => 
      typeof alt === 'string' ? alt : String(alt)
    )
  }));

  return {
    weeklyPlan: processedWeeklyPlan,
    dailyMeals: processedDailyMeals
  };
};
