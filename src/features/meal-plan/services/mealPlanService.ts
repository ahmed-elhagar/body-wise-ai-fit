
import { supabase } from '@/integrations/supabase/client';
import type { WeeklyMealPlan, MealPlanFetchResult, DailyMeal } from '../types';

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

const processMealData = (meal: any): DailyMeal => {
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
    fiber: meal.fiber,
    sugar: meal.sugar,
    prep_time: meal.prep_time || 0,
    cook_time: meal.cook_time || 0,
    servings: meal.servings || 1,
    youtube_search_term: meal.youtube_search_term,
    image_url: meal.image_url,
    recipe_fetched: meal.recipe_fetched || false,
    ingredients: safeJsonParse(meal.ingredients, []),
    instructions: safeJsonParse(meal.instructions, []),
    alternatives: safeJsonParse(meal.alternatives, [])
  };
};

export const fetchMealPlanData = async (userId: string, weekStartDateStr: string): Promise<MealPlanFetchResult | null> => {
  console.log('🎯 ENHANCED MEAL PLAN FETCH:', {
    userId: userId.substring(0, 8) + '...',
    searchingForDate: weekStartDateStr,
    timestamp: new Date().toISOString()
  });

  try {
    // First, get the most recent weekly plan for this date
    const { data: weeklyPlans, error: weeklyError } = await supabase
      .from('weekly_meal_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start_date', weekStartDateStr)
      .order('created_at', { ascending: false });

    if (weeklyError) {
      console.error('❌ Error fetching weekly plans:', weeklyError);
      throw weeklyError;
    }

    const weeklyPlan = weeklyPlans?.[0];

    if (!weeklyPlan) {
      console.log('❌ NO MEAL PLAN FOUND for week:', weekStartDateStr);
      return null;
    }

    console.log('✅ Found weekly plan:', {
      planId: weeklyPlan.id,
      weekStartDate: weeklyPlan.week_start_date,
      createdAt: weeklyPlan.created_at
    });

    // Fetch meals for the plan with better error handling
    const { data: dailyMeals, error: mealsError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('weekly_plan_id', weeklyPlan.id)
      .order('day_number', { ascending: true })
      .order('created_at', { ascending: true });

    if (mealsError) {
      console.error('❌ Error fetching daily meals:', mealsError);
      throw mealsError;
    }

    console.log('✅ Found meals for week:', {
      planId: weeklyPlan.id,
      mealsCount: dailyMeals?.length || 0,
      weekStartDate: weeklyPlan.week_start_date,
      mealsByDay: dailyMeals?.reduce((acc, meal) => {
        acc[meal.day_number] = (acc[meal.day_number] || 0) + 1;
        return acc;
      }, {} as Record<number, number>)
    });

    // Process meals data with safe JSON parsing
    const processedMeals = (dailyMeals || []).map(processMealData);

    const result = {
      weeklyPlan: {
        id: weeklyPlan.id,
        user_id: weeklyPlan.user_id,
        week_start_date: weeklyPlan.week_start_date,
        total_calories: weeklyPlan.total_calories || 0,
        total_protein: weeklyPlan.total_protein || 0,
        total_carbs: weeklyPlan.total_carbs || 0,
        total_fat: weeklyPlan.total_fat || 0,
        preferences: weeklyPlan.generation_prompt || {},
        created_at: weeklyPlan.created_at,
        updated_at: weeklyPlan.created_at,
        life_phase_context: weeklyPlan.life_phase_context
      } as WeeklyMealPlan,
      dailyMeals: processedMeals
    };

    console.log('📊 FINAL RESULT SUMMARY:', {
      hasWeeklyPlan: !!result.weeklyPlan,
      dailyMealsCount: result.dailyMeals.length,
      weekStartDate: result.weeklyPlan.week_start_date,
      totalCalories: result.weeklyPlan.total_calories
    });

    return result;
  } catch (error) {
    console.error('❌ CRITICAL ERROR in fetchMealPlanData:', error);
    throw error;
  }
};

// Enhanced validation function to check if data exists
export const validateMealPlanExists = async (userId: string, weekStartDateStr: string): Promise<boolean> => {
  try {
    const { data: weeklyPlan, error } = await supabase
      .from('weekly_meal_plans')
      .select('id')
      .eq('user_id', userId)
      .eq('week_start_date', weekStartDateStr)
      .single();

    return !error && !!weeklyPlan;
  } catch {
    return false;
  }
};
