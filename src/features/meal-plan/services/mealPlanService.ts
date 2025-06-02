
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import type { WeeklyMealPlan, MealPlanFetchResult, DailyMeal } from '../types';

const processMealData = (meal: any): DailyMeal => {
  const safeJsonParse = (field: any, fallback: any = []) => {
    if (!field) return fallback;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return fallback;
      }
    }
    if (Array.isArray(field)) return field;
    return fallback;
  };

  return {
    id: meal.id,
    weekly_plan_id: meal.weekly_plan_id,
    day_number: meal.day_number,
    meal_type: meal.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2',
    name: meal.name,
    calories: meal.calories || 0,
    protein: meal.protein || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0,
    fiber: meal.fiber || 0,
    sugar: meal.sugar || 0,
    ingredients: safeJsonParse(meal.ingredients, []),
    instructions: safeJsonParse(meal.instructions, []),
    prep_time: meal.prep_time || 0,
    cook_time: meal.cook_time || 0,
    servings: meal.servings || 1,
    youtube_search_term: meal.youtube_search_term,
    image_url: meal.image_url,
    alternatives: safeJsonParse(meal.alternatives, []),
    description: meal.description,
    difficulty: meal.difficulty,
    cuisine: meal.cuisine,
    tips: meal.tips,
    nutrition_benefits: meal.nutrition_benefits,
    cultural_info: meal.cultural_info,
    recipe_fetched: meal.recipe_fetched || false
  };
};

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
      updated_at: weeklyPlan.created_at, // Use created_at as fallback since updated_at doesn't exist
      life_phase_context: weeklyPlan.life_phase_context
    } as WeeklyMealPlan,
    dailyMeals: processedMeals
  };
};
