
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { format } from 'date-fns';
import { startOfWeek, addWeeks } from 'date-fns';
import { getWeekStartDate } from '@/utils/mealPlanUtils';

export const useDynamicMealPlan = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const targetWeekStart = getWeekStartDate(weekOffset);
  const targetWeekStartString = format(targetWeekStart, 'yyyy-MM-dd');

  console.log('🔍 useDynamicMealPlan: Fetching for week offset:', weekOffset, 'Target date:', targetWeekStart);

  const { data: currentWeekPlan, isLoading, error, refetch } = useQuery({
    queryKey: ['meal-plan', user?.id, weekOffset, targetWeekStartString],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ No user ID available for meal plan fetch');
        return null;
      }

      console.log('📡 Fetching meal plan for user:', user.id, 'week:', targetWeekStartString);

      // First, get the weekly plan using correct table name
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', targetWeekStartString)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (weeklyError) {
        console.error('❌ Error fetching weekly plan:', weeklyError);
        throw weeklyError;
      }

      if (!weeklyPlan) {
        console.log('ℹ️ No weekly plan data returned');
        return null;
      }

      // Then get the daily meals for this week
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
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false
  });

  return {
    data: currentWeekPlan,
    isLoading,
    error,
    refetch
  };
};
