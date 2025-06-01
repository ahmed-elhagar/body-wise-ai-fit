
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfWeek } from 'date-fns';

export const useMealPlanState = () => {
  const { user } = useAuth();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekStart.toISOString()],
    queryFn: async () => {
      if (!user) return null;

      const { data: weeklyPlan, error: planError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStart.toISOString().split('T')[0])
        .single();

      if (planError && planError.code !== 'PGRST116') {
        throw planError;
      }

      if (!weeklyPlan) {
        return {
          currentWeekPlan: null,
          dailyMeals: []
        };
      }

      const { data: dailyMeals, error: mealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true });

      if (mealsError) {
        throw mealsError;
      }

      return {
        currentWeekPlan: weeklyPlan,
        dailyMeals: dailyMeals || []
      };
    },
    enabled: !!user
  });

  return {
    currentWeekPlan: data?.currentWeekPlan || null,
    dailyMeals: data?.dailyMeals || [],
    isLoading,
    error,
    refetch,
    // Mock functions for compatibility
    fetchMealPlan: refetch,
    createMealPlan: () => Promise.resolve(),
    updateMealPlan: () => Promise.resolve(),
    deleteMealPlan: () => Promise.resolve(),
    addMealToDay: () => Promise.resolve(),
    removeMealFromDay: () => Promise.resolve(),
    exchangeMealInDay: () => Promise.resolve(),
    isMealPlanLoading: isLoading
  };
};
