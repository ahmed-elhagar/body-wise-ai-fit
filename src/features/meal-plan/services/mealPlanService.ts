
import { supabase } from '@/integrations/supabase/client';
import { validateMealType } from '../utils/mealTypeValidator';
import type { DailyMeal, WeeklyMealPlan } from '../types';

export interface MealPlanFetchResult {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

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

    // Process and validate meal data
    const processedMeals: DailyMeal[] = (dailyMealsData || []).map(meal => ({
      ...meal,
      meal_type: validateMealType(meal.meal_type),
      ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      instructions: Array.isArray(meal.instructions) ? meal.instructions : [],
      alternatives: Array.isArray(meal.alternatives) ? meal.alternatives : []
    }));

    console.log('✅ Meal plan data fetched successfully:', {
      weeklyPlanId: weeklyPlanData.id,
      mealsCount: processedMeals.length
    });

    return {
      weeklyPlan: weeklyPlanData,
      dailyMeals: processedMeals
    };

  } catch (error) {
    console.error('❌ Error in fetchMealPlanData:', error);
    throw error;
  }
};
