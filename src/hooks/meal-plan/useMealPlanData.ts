
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format, startOfWeek, addWeeks } from 'date-fns';
import type { MealPlanFetchResult, DailyMeal } from '@/types/mealPlan';

const processMealData = (meal: any): DailyMeal => {
  // Safely parse JSON fields
  const parseJsonField = (field: any, fallback: any = []) => {
    if (!field) return fallback;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return fallback;
      }
    }
    return Array.isArray(field) ? field : fallback;
  };

  return {
    ...meal,
    ingredients: parseJsonField(meal.ingredients, []),
    instructions: parseJsonField(meal.instructions, []),
    alternatives: parseJsonField(meal.alternatives, [])
  };
};

export const useMealPlanData = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const getWeekStartDate = (offset: number) => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
    const targetWeek = addWeeks(currentWeekStart, offset);
    return format(targetWeek, 'yyyy-MM-dd');
  };

  const targetWeekStart = getWeekStartDate(weekOffset);

  return useQuery({
    queryKey: ['meal-plan', user?.id, weekOffset, targetWeekStart],
    queryFn: async (): Promise<MealPlanFetchResult | null> => {
      if (!user?.id) {
        console.log('❌ No user ID available for meal plan fetch');
        return null;
      }

      console.log('📡 Fetching meal plan for user:', user.id, 'week:', targetWeekStart);

      // Fetch weekly plan
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', targetWeekStart)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (weeklyError) {
        console.error('❌ Error fetching weekly plan:', weeklyError);
        throw weeklyError;
      }

      if (!weeklyPlan) {
        console.log('ℹ️ No meal plan found for this week');
        return null;
      }

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

      const processedMeals = (dailyMeals || []).map(processMealData);

      console.log('✅ Meal plan fetched successfully:', {
        weeklyPlanId: weeklyPlan.id,
        dailyMealsCount: processedMeals.length,
        weekStartDate: weeklyPlan.week_start_date
      });

      return {
        weeklyPlan,
        dailyMeals: processedMeals
      };
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};
