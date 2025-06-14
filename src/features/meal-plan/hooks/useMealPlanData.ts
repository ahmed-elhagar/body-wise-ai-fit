
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryForIngredient } from '../utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal, MealIngredient } from '../types';

interface MealPlanData {
  weeklyPlan: WeeklyMealPlan | null;
  dailyMeals: DailyMeal[];
}

// Helper function to safely parse JSON data
const safeJsonParse = (data: any, fallback: any = []): any => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }
  return data || fallback;
};

// Helper function to convert database meal to our DailyMeal type
const convertDatabaseMeal = (dbMeal: any): DailyMeal => {
  return {
    id: dbMeal.id,
    weekly_plan_id: dbMeal.weekly_plan_id,
    day_number: dbMeal.day_number,
    meal_type: dbMeal.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'snack1' | 'snack2',
    name: dbMeal.name,
    calories: dbMeal.calories,
    protein: dbMeal.protein,
    carbs: dbMeal.carbs,
    fat: dbMeal.fat,
    ingredients: safeJsonParse(dbMeal.ingredients, []) as MealIngredient[],
    instructions: safeJsonParse(dbMeal.instructions, []) as string[],
    prep_time: dbMeal.prep_time,
    cook_time: dbMeal.cook_time,
    servings: dbMeal.servings,
    alternatives: safeJsonParse(dbMeal.alternatives, []) as string[],
    image_url: dbMeal.image_url,
    youtube_search_term: dbMeal.youtube_search_term,
    recipe_fetched: dbMeal.recipe_fetched,
    created_at: dbMeal.created_at
  };
};

export const useMealPlanData = (weekStartDate: string) => {
  const { user } = useAuth();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['mealPlan', user?.id, weekStartDate],
    queryFn: async (): Promise<MealPlanData> => {
      if (!user?.id) {
        console.log('No user ID, returning default meal plan data');
        return { weeklyPlan: null, dailyMeals: [] };
      }

      try {
        // Fetch weekly meal plan
        const { data: weeklyPlanData, error: weeklyPlanError } = await supabase
          .from('weekly_meal_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start_date', weekStartDate)
          .single();

        if (weeklyPlanError) {
          console.error('Error fetching weekly meal plan:', weeklyPlanError);
          throw new Error(weeklyPlanError.message);
        }

        // If no weekly plan exists, return default data
        if (!weeklyPlanData) {
          console.log('No weekly meal plan found, returning default data');
          return { weeklyPlan: null, dailyMeals: [] };
        }

        // Fetch daily meals for the weekly plan
        const { data: dailyMealsData, error: dailyMealsError } = await supabase
          .from('daily_meals')
          .select('*')
          .eq('weekly_plan_id', weeklyPlanData.id);

        if (dailyMealsError) {
          console.error('Error fetching daily meals:', dailyMealsError);
          throw new Error(dailyMealsError.message);
        }

        // Convert and sort daily meals by meal type
        const convertedMeals = (dailyMealsData || []).map(convertDatabaseMeal);
        
        const sortedDailyMeals = convertedMeals.sort((a, b) => {
          const mealTypeOrder = {
            'breakfast': 1,
            'lunch': 2,
            'dinner': 3,
            'snack': 4,
            'snack1': 5,
            'snack2': 6,
          };

          const orderA = mealTypeOrder[a.meal_type] || 7;
          const orderB = mealTypeOrder[b.meal_type] || 7;

          return orderA - orderB;
        });

        console.log('Fetched meal plan data:', {
          weeklyPlan: weeklyPlanData,
          dailyMeals: sortedDailyMeals,
        });

        return {
          weeklyPlan: weeklyPlanData as WeeklyMealPlan,
          dailyMeals: sortedDailyMeals,
        };
      } catch (err: any) {
        console.error('Error fetching meal plan data:', err);
        throw new Error(err.message);
      }
    },
    enabled: !!user?.id,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
