
import { supabase } from '@/integrations/supabase/client';
import type { MealPlanFetchResult, DailyMeal, WeeklyMealPlan } from '../types';

export const fetchMealPlanData = async (
  userId: string,
  weekStartDate: string
): Promise<MealPlanFetchResult | null> => {
  console.log('🔍 Fetching meal plan data:', { userId, weekStartDate });

  try {
    // Fetch weekly meal plan
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('weekly_meal_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start_date', weekStartDate)
      .maybeSingle();

    if (weeklyError) {
      console.error('❌ Weekly plan fetch error:', weeklyError);
      throw weeklyError;
    }

    if (!weeklyData) {
      console.log('📭 No weekly plan found for:', weekStartDate);
      return null;
    }

    // Fetch daily meals
    const { data: dailyData, error: dailyError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('weekly_plan_id', weeklyData.id)
      .order('day_number', { ascending: true });

    if (dailyError) {
      console.error('❌ Daily meals fetch error:', dailyError);
      throw dailyError;
    }

    const dailyMeals: DailyMeal[] = (dailyData || []).map(meal => ({
      id: meal.id,
      weekly_plan_id: meal.weekly_plan_id,
      day_number: meal.day_number,
      meal_type: meal.meal_type,
      name: meal.name,
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      fiber: meal.fiber || 0,
      prep_time: meal.prep_time || 0,
      cook_time: meal.cook_time || 0,
      servings: meal.servings || 1,
      youtube_search_term: meal.youtube_search_term,
      image_url: meal.image_url,
      recipe_fetched: meal.recipe_fetched || false,
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
      alternatives: Array.isArray(meal.alternatives) ? meal.alternatives : []
    }));

    const weeklyPlan: WeeklyMealPlan = {
      id: weeklyData.id,
      user_id: weeklyData.user_id,
      week_start_date: weeklyData.week_start_date,
      total_calories: weeklyData.total_calories || 0,
      total_protein: weeklyData.total_protein || 0,
      total_carbs: weeklyData.total_carbs || 0,
      total_fat: weeklyData.total_fat || 0,
      preferences: weeklyData.generation_prompt || {},
      created_at: weeklyData.created_at,
      updated_at: weeklyData.created_at,
      life_phase_context: weeklyData.life_phase_context || {}
    };

    console.log('✅ Meal plan data fetched successfully:', {
      weeklyPlanId: weeklyPlan.id,
      dailyMealsCount: dailyMeals.length
    });

    return {
      weeklyPlan,
      dailyMeals
    };
  } catch (error) {
    console.error('❌ Fetch meal plan data error:', error);
    throw error;
  }
};
