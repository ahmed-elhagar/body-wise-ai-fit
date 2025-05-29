
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getWeekStartDate } from '@/utils/mealPlanUtils';

export interface MealIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface DailyMeal {
  id: string;
  weekly_plan_id: string;
  day_number: number;
  meal_type: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: MealIngredient[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  youtube_search_term?: string;
  image_url?: string;
}

export interface WeeklyMealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  generation_prompt: any;
  created_at: string;
}

export const useMealPlanData = (weekOffset: number = 0) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekOffset],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useMealPlanData - No user ID for meal plan fetch');
        return null;
      }
      
      try {
        // Use CONSISTENT week calculation - EXACT week only
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = weekStartDate.toISOString().split('T')[0];
        
        console.log('🎯 MEAL PLAN FETCH - EXACT WEEK ONLY:', {
          userId: user.id,
          weekOffset,
          searchingForDate: weekStartDateStr,
          today: new Date().toISOString().split('T')[0]
        });
        
        // Fetch ONLY the exact week - no fallbacks
        const { data: weeklyPlan, error: weeklyError } = await supabase
          .from('weekly_meal_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start_date', weekStartDateStr)
          .maybeSingle();

        if (weeklyError) {
          console.error('❌ Error fetching weekly plan:', weeklyError);
          throw weeklyError;
        }

        if (!weeklyPlan) {
          console.log('❌ NO MEAL PLAN FOUND for exact week:', {
            searchedDate: weekStartDateStr,
            weekOffset,
            userId: user.id
          });
          
          // Check what weeks exist for debugging
          const { data: allPlans } = await supabase
            .from('weekly_meal_plans')
            .select('id, week_start_date, total_calories')
            .eq('user_id', user.id)
            .order('week_start_date', { ascending: false });
          
          console.log('🔍 AVAILABLE WEEKS FOR USER:', {
            searchedWeek: weekStartDateStr,
            availableWeeks: allPlans?.map(p => p.week_start_date) || [],
            totalPlans: allPlans?.length || 0
          });
          
          // Return null for no data - no fallbacks
          return null;
        }

        console.log('✅ Found EXACT meal plan for week:', {
          planId: weeklyPlan.id,
          weekStartDate: weeklyPlan.week_start_date,
          weekOffset,
          totalCalories: weeklyPlan.total_calories
        });

        // Fetch meals for the exact plan
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

        console.log('✅ Found meals for exact week:', {
          weekOffset,
          planId: weeklyPlan.id,
          mealsCount: dailyMeals?.length || 0,
          weekStartDate: weeklyPlan.week_start_date
        });

        // Process meals data
        const processedMeals = (dailyMeals || []).map(meal => {
          try {
            return {
              ...meal,
              ingredients: Array.isArray(meal.ingredients) 
                ? meal.ingredients 
                : typeof meal.ingredients === 'string' 
                  ? JSON.parse(meal.ingredients || '[]')
                  : [],
              instructions: Array.isArray(meal.instructions)
                ? meal.instructions
                : typeof meal.instructions === 'string'
                  ? JSON.parse(meal.instructions || '[]')
                  : []
            };
          } catch (parseError) {
            console.error('Error parsing meal data:', parseError, meal);
            return {
              ...meal,
              ingredients: [],
              instructions: []
            };
          }
        }) as DailyMeal[];

        return {
          weeklyPlan: weeklyPlan as WeeklyMealPlan,
          dailyMeals: processedMeals
        };
      } catch (error) {
        console.error('❌ useMealPlanData - Unexpected error:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000, // Very short stale time for immediate updates
    gcTime: 5000, // Short cache time
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('JWT')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};
