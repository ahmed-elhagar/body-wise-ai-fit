
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Import types from features instead of defining locally
export type { 
  WeeklyMealPlan, 
  DailyMeal, 
  MealPlanFetchResult 
} from '@/features/meal-plan/types';

export const useMealPlanData = (weekOffset: number = 0) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekOffset],
    queryFn: async (): Promise<any | null> => {
      if (!user?.id) return null;

      // Calculate the week start date
      const today = new Date();
      const currentSaturday = new Date(today);
      currentSaturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));
      
      const targetWeek = new Date(currentSaturday);
      targetWeek.setDate(currentSaturday.getDate() + (weekOffset * 7));
      
      const weekStartDate = targetWeek.toISOString().split('T')[0];

      // Fetch weekly plan
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      if (weeklyError) {
        console.error('Error fetching weekly plan:', weeklyError);
        throw weeklyError;
      }

      if (!weeklyPlan) {
        return { weeklyPlan: null, dailyMeals: [] };
      }

      // Fetch daily meals
      const { data: dailyMeals, error: mealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true })
        .order('meal_type', { ascending: true });

      if (mealsError) {
        console.error('Error fetching daily meals:', mealsError);
        throw mealsError;
      }

      return {
        weeklyPlan,
        dailyMeals: dailyMeals || []
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
