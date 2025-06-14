
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getCategoryForIngredient } from '../utils/mealPlanUtils';
import type { WeeklyMealPlan, DailyMeal } from '../types';

interface MealPlanData {
  weeklyPlan: WeeklyMealPlan | null;
  dailyMeals: DailyMeal[];
}

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

        // Sort daily meals by meal type
        const sortedDailyMeals = dailyMealsData ? [...dailyMealsData].sort((a, b) => {
          const mealTypeOrder = {
            'breakfast': 1,
            'lunch': 2,
            'dinner': 3,
            'snack': 4,
            'snack1': 5,
            'snack2': 6,
          };

          const mealTypeA = a.meal_type ? a.meal_type.toLowerCase() : '';
          const mealTypeB = b.meal_type ? b.meal_type.toLowerCase() : '';

          const orderA = mealTypeOrder[mealTypeA as keyof typeof mealTypeOrder] || 7;
          const orderB = mealTypeOrder[mealTypeB as keyof typeof mealTypeOrder] || 7;

          return orderA - orderB;
        }) : [];

        console.log('Fetched meal plan data:', {
          weeklyPlan: weeklyPlanData,
          dailyMeals: sortedDailyMeals,
        });

        return {
          weeklyPlan: weeklyPlanData as WeeklyMealPlan,
          dailyMeals: sortedDailyMeals as DailyMeal[],
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
