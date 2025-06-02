
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
      console.warn('Failed to parse JSON:', value);
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
      try {
        // Parse ingredients safely
        const ingredients: MealIngredient[] = safeJsonParse(meal.ingredients, []).map((ing: any) => {
          if (typeof ing === 'string') {
            return { name: ing, quantity: '1', unit: 'serving' };
          }
          return {
            name: ing?.name || 'Unknown ingredient',
            quantity: String(ing?.quantity || '1'),
            unit: ing?.unit || 'serving'
          };
        });

        // Parse instructions safely
        const instructions: string[] = safeJsonParse(meal.instructions, []).map((inst: any) => 
          typeof inst === 'string' ? inst : String(inst || '')
        );

        // Parse alternatives safely
        const alternatives: string[] = safeJsonParse(meal.alternatives, []).map((alt: any) => 
          typeof alt === 'string' ? alt : String(alt || '')
        );

        return {
          id: meal.id,
          weekly_plan_id: meal.weekly_plan_id,
          day_number: meal.day_number,
          meal_type: validateMealType(meal.meal_type),
          name: meal.name || 'Unnamed Meal',
          calories: Number(meal.calories) || 0,
          protein: Number(meal.protein) || 0,
          carbs: Number(meal.carbs) || 0,
          fat: Number(meal.fat) || 0,
          fiber: Number(meal.fiber) || 0,
          sugar: Number(meal.sugar) || 0,
          prep_time: Number(meal.prep_time) || 0,
          cook_time: Number(meal.cook_time) || 0,
          servings: Number(meal.servings) || 1,
          youtube_search_term: meal.youtube_search_term || '',
          image_url: meal.image_url || '',
          recipe_fetched: Boolean(meal.recipe_fetched),
          ingredients,
          instructions,
          alternatives,
          created_at: meal.created_at || new Date().toISOString()
        };
      } catch (error) {
        console.error('❌ Error processing meal:', meal, error);
        // Return a fallback meal object to prevent crashes
        return {
          id: meal.id || 'unknown',
          weekly_plan_id: meal.weekly_plan_id || '',
          day_number: meal.day_number || 1,
          meal_type: 'snack' as const,
          name: meal.name || 'Error Loading Meal',
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          prep_time: 0,
          cook_time: 0,
          servings: 1,
          youtube_search_term: '',
          image_url: '',
          recipe_fetched: false,
          ingredients: [],
          instructions: [],
          alternatives: [],
          created_at: new Date().toISOString()
        };
      }
    });

    // Create properly typed weekly plan
    const weeklyPlan: WeeklyMealPlan = {
      id: weeklyPlanData.id,
      user_id: weeklyPlanData.user_id,
      week_start_date: weeklyPlanData.week_start_date,
      total_calories: Number(weeklyPlanData.total_calories) || 0,
      total_protein: Number(weeklyPlanData.total_protein) || 0,
      total_carbs: Number(weeklyPlanData.total_carbs) || 0,
      total_fat: Number(weeklyPlanData.total_fat) || 0,
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
