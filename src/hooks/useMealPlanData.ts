
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
        // Use CONSISTENT week calculation
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = weekStartDate.toISOString().split('T')[0];
        
        console.log('🎯 MEAL PLAN FETCH - ENHANCED DEBUG:', {
          userId: user.id,
          userEmail: user.email,
          weekOffset,
          weekStartDate: weekStartDateStr,
          today: new Date().toISOString().split('T')[0],
          calculatedWeek: weekStartDate.toDateString()
        });
        
        // Try to find the specific week first with better error handling
        const { data: weeklyPlan, error: weeklyError } = await supabase
          .from('weekly_meal_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('week_start_date', weekStartDateStr)
          .maybeSingle();

        if (weeklyError) {
          console.error('❌ useMealPlanData - Error fetching weekly plan:', weeklyError);
          throw weeklyError;
        }

        if (!weeklyPlan) {
          console.log('❌ NO MEAL PLAN FOUND for exact date:', weekStartDateStr);
          
          // Check what meal plans exist for this user for debugging
          const { data: allPlans } = await supabase
            .from('weekly_meal_plans')
            .select('id, week_start_date, created_at, total_calories')
            .eq('user_id', user.id)
            .order('week_start_date', { ascending: false });
          
          console.log('🔍 ALL USER MEAL PLANS:', {
            searchedDate: weekStartDateStr,
            userPlans: allPlans?.map(p => ({ 
              id: p.id, 
              week_start_date: p.week_start_date, 
              created_at: p.created_at,
              total_calories: p.total_calories
            })) || [],
            totalFound: allPlans?.length || 0
          });
          
          return null;
        }

        console.log('✅ Found exact meal plan:', {
          planId: weeklyPlan.id,
          weekStartDate: weeklyPlan.week_start_date,
          totalCalories: weeklyPlan.total_calories,
          userId: weeklyPlan.user_id
        });

        // Fetch meals for the found plan with better error handling
        const { data: dailyMeals, error: mealsError } = await supabase
          .from('daily_meals')
          .select('*')
          .eq('weekly_plan_id', weeklyPlan.id)
          .order('day_number', { ascending: true })
          .order('meal_type', { ascending: true });

        if (mealsError) {
          console.error('❌ useMealPlanData - Error fetching daily meals:', mealsError);
          throw mealsError;
        }

        console.log('✅ Found daily meals:', {
          count: dailyMeals?.length || 0,
          planId: weeklyPlan.id,
          meals: dailyMeals?.map(m => ({ 
            id: m.id,
            day: m.day_number, 
            type: m.meal_type, 
            name: m.name 
          })) || []
        });

        // Process meals data with better error handling
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

        console.log('✅ MEAL PLAN LOADED SUCCESSFULLY:', {
          userId: user.id,
          planId: weeklyPlan.id,
          mealsCount: processedMeals.length,
          weekStartDate: weeklyPlan.week_start_date,
          searchedDate: weekStartDateStr,
          weekOffset: weekOffset
        });

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
