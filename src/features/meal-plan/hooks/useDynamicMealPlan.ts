
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { startOfWeek, addWeeks } from 'date-fns';

export const useDynamicMealPlan = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const getTargetWeekStart = () => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 });
    const targetWeek = addWeeks(currentWeekStart, weekOffset);
    return format(targetWeek, 'yyyy-MM-dd');
  };

  const targetWeekStart = getTargetWeekStart();

  console.log('🔍 useDynamicMealPlan: Fetching for week offset:', weekOffset, 'Target date:', targetWeekStart);

  const { data: currentWeekPlan, isLoading, error, refetch } = useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekOffset, targetWeekStart],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ No user ID available for meal plan fetch');
        return null;
      }

      console.log('📡 Fetching meal plan for user:', user.id, 'week:', targetWeekStart);

      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', targetWeekStart)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (weeklyError) {
        if (weeklyError.code === 'PGRST116') {
          console.log('ℹ️ No meal plan found for this week');
          return null;
        }
        console.error('❌ Error fetching weekly plan:', weeklyError);
        throw weeklyError;
      }

      if (!weeklyPlan) {
        console.log('ℹ️ No weekly plan data returned');
        return null;
      }

      const { data: dailyMeals, error: mealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true })
        .order('created_at', { ascending: true });

      if (mealsError) {
        console.error('❌ Error fetching daily meals:', mealsError);
        throw mealsError;
      }

      const result = {
        weeklyPlan,
        dailyMeals: dailyMeals || []
      };

      console.log('✅ Meal plan fetched successfully:', {
        weeklyPlanId: weeklyPlan.id,
        dailyMealsCount: dailyMeals?.length || 0,
        weekStartDate: weeklyPlan.week_start_date
      });

      return result;
    },
    enabled: !!user?.id,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  return {
    currentWeekPlan,
    isLoading,
    error,
    refetch
  };
};
