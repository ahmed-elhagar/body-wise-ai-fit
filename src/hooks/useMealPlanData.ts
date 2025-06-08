
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

      // Calculate the week start date - Saturday is day 1
      const today = new Date();
      const currentDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Calculate days since last Saturday
      const daysSinceSaturday = currentDayOfWeek === 6 ? 0 : currentDayOfWeek + 1;
      
      const currentSaturday = new Date(today);
      currentSaturday.setDate(today.getDate() - daysSinceSaturday);
      currentSaturday.setHours(0, 0, 0, 0);
      
      const targetWeek = new Date(currentSaturday);
      targetWeek.setDate(currentSaturday.getDate() + (weekOffset * 7));
      
      const weekStartDate = targetWeek.toISOString().split('T')[0];

      console.log('📅 Week calculation:', {
        today: today.toISOString().split('T')[0],
        currentDayOfWeek,
        daysSinceSaturday,
        currentSaturday: currentSaturday.toISOString().split('T')[0],
        weekOffset,
        calculatedWeekStart: weekStartDate
      });

      // First check if ANY meal plans exist for this user
      const { data: allPlans, error: allPlansError } = await supabase
        .from('weekly_meal_plans')
        .select('id, week_start_date, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (allPlansError) {
        console.error('❌ Error checking all plans:', allPlansError);
      } else {
        console.log('📊 All meal plans for user:', {
          count: allPlans?.length || 0,
          plans: allPlans?.map(p => ({ 
            id: p.id, 
            weekStart: p.week_start_date, 
            created: p.created_at 
          }))
        });
      }

      // Fetch weekly plan for the specific week
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

      console.log('📋 Weekly plan result:', {
        found: !!weeklyPlan,
        weekStartDate,
        planId: weeklyPlan?.id,
        planData: weeklyPlan
      });

      if (!weeklyPlan) {
        console.log('📋 No weekly meal plan found for date:', weekStartDate);
        
        // Try to find the closest plan
        if (allPlans && allPlans.length > 0) {
          console.log('🔍 Trying to find closest plan...');
          const closestPlan = allPlans[0]; // Most recent plan
          
          // Fetch meals for the closest plan to show something
          const { data: fallbackMeals } = await supabase
            .from('daily_meals')
            .select('*')
            .eq('weekly_plan_id', closestPlan.id)
            .order('day_number', { ascending: true })
            .order('meal_type', { ascending: true });
          
          console.log('📋 Using fallback plan:', {
            planId: closestPlan.id,
            weekStart: closestPlan.week_start_date,
            mealsCount: fallbackMeals?.length || 0
          });
          
          return {
            weeklyPlan: closestPlan,
            dailyMeals: fallbackMeals || []
          };
        }
        
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
        weeklyPlanId: weeklyPlan.id,
        meals: dailyMeals?.map(m => ({ 
          id: m.id, 
          name: m.name, 
          day: m.day_number, 
          type: m.meal_type,
          calories: m.calories 
        }))
      });

      const result = {
        weeklyPlan,
        dailyMeals: dailyMeals || []
      };

      console.log('🎯 Final result:', {
        hasWeeklyPlan: !!result.weeklyPlan,
        mealsCount: result.dailyMeals.length,
        structure: result
      });

      return result;
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
