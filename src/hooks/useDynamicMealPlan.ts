
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useDynamicMealPlan = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const getWeekStartDate = (offset: number) => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay() + (offset * 7));
    return currentWeekStart.toISOString().split('T')[0];
  };

  const { data: currentWeekPlan, isLoading } = useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekOffset],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const weekStartDate = getWeekStartDate(weekOffset);
      
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      if (weeklyError) {
        console.error('Error fetching weekly plan:', weeklyError);
        return null;
      }

      if (!weeklyPlan) {
        return null;
      }

      const { data: dailyMeals, error: mealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true })
        .order('meal_type', { ascending: true });

      if (mealsError) {
        console.error('Error fetching daily meals:', mealsError);
        return null;
      }

      return {
        weeklyPlan,
        dailyMeals: dailyMeals || []
      };
    },
    enabled: !!user?.id,
  });

  return {
    currentWeekPlan,
    isLoading,
    getWeekStartDate
  };
};
