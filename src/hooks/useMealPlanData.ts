
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
      if (!user?.id) {
        console.log('❌ No user ID for meal plan fetch');
        return null;
      }

      console.log('🔍 Fetching meal plan data:', {
        userId: user.id.substring(0, 8) + '...',
        weekOffset
      });

      // Calculate the week start date
      const today = new Date();
      const currentSaturday = new Date(today);
      currentSaturday.setDate(today.getDate() - ((today.getDay() + 1) % 7));
      
      const targetWeek = new Date(currentSaturday);
      targetWeek.setDate(currentSaturday.getDate() + (weekOffset * 7));
      
      const weekStartDate = targetWeek.toISOString().split('T')[0];

      console.log('📅 Calculated week start date:', weekStartDate);

      // Fetch weekly plan
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      if (weeklyError) {
        console.error('❌ Error fetching weekly plan:', weeklyError);
        throw weeklyError;
      }

      if (!weeklyPlan) {
        console.log('📋 No weekly meal plan found for date:', weekStartDate);
        return { weeklyPlan: null, dailyMeals: [] };
      }

      console.log('✅ Weekly plan found:', weeklyPlan.id);

      // Fetch daily meals
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

      console.log('✅ Daily meals fetched:', {
        count: dailyMeals?.length || 0,
        weeklyPlanId: weeklyPlan.id
      });

      return {
        weeklyPlan,
        dailyMeals: dailyMeals || []
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};
