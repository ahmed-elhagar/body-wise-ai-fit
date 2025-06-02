
import { supabase } from '@/integrations/supabase/client';
import { validateMealType } from '../utils/mealTypeValidator';
import type { DailyMeal, WeeklyMealPlan, MealIngredient } from '../types';

export interface MealPlanFetchResult {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

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

export const fetchMealPlanData = async (userId: string, weekStartDate: string): Promise<MealPlanFetchResult | null> => {
  console.log('🔄 Fetching meal plan data:', { userId, weekStartDate });

  try {
    // Fetch weekly plan
    const { data: weeklyPlanData, error: weeklyError } = await supabase
      .from('weekly_meal_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start_date', weekStartDate)
      .maybeSingle();

    if (weeklyError) {
      console.error('❌ Error fetching weekly plan:', weeklyError);
      throw weeklyError;
    }

    if (!weeklyPlanData) {
      console.log('📭 No weekly plan found for this week');
      return null;
    }

    // Fetch daily meals
    const { data: dailyMealsData, error: dailyError } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('weekly_plan_id', weeklyPlanData.id)
      .order('day_number', { ascending: true })
      .order('meal_type', { ascending: true });

    if (dailyError) {
      console.error('❌ Error fetching daily meals:', dailyError);
      throw dailyError;
    }

    // Process and validate meal data with proper type handling
    const processedMeals: DailyMeal[] = (dailyMealsData || []).map(meal => {
      // Parse ingredients safely
      const ingredients: MealIngredient[] = safeJsonParse(meal.ingredients, []).map((ing: any) => ({
        name: ing?.name || '',
        quantity: ing?.quantity || '',
        unit: ing?.unit || ''
      }));

      // Parse instructions safely
      const instructions: string[] = safeJsonParse(meal.instructions, []);

      // Parse alternatives safely
      const alternatives: string[] = safeJsonParse(meal.alternatives, []);

      return {
        id: meal.id,
        weekly_plan_id: meal.weekly_plan_id,
        day_number: meal.day_number,
        meal_type: validateMealType(meal.meal_type) as 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2',
        name: meal.name,
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        fiber: 0, // Default value since not in database
        sugar: 0, // Default value since not in database
        prep_time: meal.prep_time || 0,
        cook_time: meal.cook_time || 0,
        servings: meal.servings || 1,
        youtube_search_term: meal.youtube_search_term || '',
        image_url: meal.image_url || '',
        recipe_fetched: meal.recipe_fetched || false,
        ingredients,
        instructions,
        alternatives,
        created_at: meal.created_at || new Date().toISOString()
      };
    });

    // Create properly typed weekly plan
    const weeklyPlan: WeeklyMealPlan = {
      id: weeklyPlanData.id,
      user_id: weeklyPlanData.user_id,
      week_start_date: weeklyPlanData.week_start_date,
      total_calories: weeklyPlanData.total_calories || 0,
      total_protein: weeklyPlanData.total_protein || 0,
      total_carbs: weeklyPlanData.total_carbs || 0,
      total_fat: weeklyPlanData.total_fat || 0,
      preferences: weeklyPlanData.generation_prompt || {},
      created_at: weeklyPlanData.created_at,
      updated_at: weeklyPlanData.created_at,
      life_phase_context: weeklyPlanData.life_phase_context || {}
    };

    console.log('✅ Meal plan data fetched successfully:', {
      weeklyPlanId: weeklyPlan.id,
      mealsCount: processedMeals.length
    });

    return {
      weeklyPlan,
      dailyMeals: processedMeals
    };

  } catch (error) {
    console.error('❌ Error in fetchMealPlanData:', error);
    throw error;
  }
};
