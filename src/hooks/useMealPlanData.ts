
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { format } from 'date-fns';

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
  alternatives?: any[];
  recipe_fetched?: boolean;
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
  life_phase_context?: any;
}

// Helper function to safely parse JSON fields
const safeParseJson = (jsonField: any, fallback: any = []) => {
  if (Array.isArray(jsonField)) return jsonField;
  if (typeof jsonField === 'string') {
    try {
      return JSON.parse(jsonField);
    } catch {
      return fallback;
    }
  }
  return jsonField || fallback;
};

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
        // Use CONSISTENT week calculation with proper date formatting
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
        
        console.log('🎯 MEAL PLAN FETCH - ENHANCED CONSISTENCY:', {
          userId: user.id,
          weekOffset,
          searchingForDate: weekStartDateStr,
          today: format(new Date(), 'yyyy-MM-dd'),
          weekStartCalculated: weekStartDate.toISOString().split('T')[0]
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
          
          // Enhanced debugging - check what weeks exist
          const { data: allPlans } = await supabase
            .from('weekly_meal_plans')
            .select('id, week_start_date, total_calories')
            .eq('user_id', user.id)
            .order('week_start_date', { ascending: false });
          
          console.log('🔍 AVAILABLE WEEKS FOR USER:', {
            searchedWeek: weekStartDateStr,
            availableWeeks: allPlans?.map(p => ({
              date: p.week_start_date,
              id: p.id,
              calories: p.total_calories
            })) || [],
            totalPlans: allPlans?.length || 0
          });
          
          // Return null for no data
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
          weekStartDate: weeklyPlan.week_start_date,
          mealsByDay: dailyMeals?.reduce((acc, meal) => {
            acc[meal.day_number] = (acc[meal.day_number] || 0) + 1;
            return acc;
          }, {} as Record<number, number>)
        });

        // Process meals data with enhanced error handling and proper type conversion
        const processedMeals: DailyMeal[] = (dailyMeals || []).map(meal => {
          try {
            return {
              id: meal.id,
              weekly_plan_id: meal.weekly_plan_id,
              day_number: meal.day_number,
              meal_type: meal.meal_type,
              name: meal.name,
              calories: meal.calories || 0,
              protein: meal.protein || 0,
              carbs: meal.carbs || 0,
              fat: meal.fat || 0,
              prep_time: meal.prep_time || 0,
              cook_time: meal.cook_time || 0,
              servings: meal.servings || 1,
              youtube_search_term: meal.youtube_search_term,
              image_url: meal.image_url,
              recipe_fetched: meal.recipe_fetched || false,
              ingredients: safeParseJson(meal.ingredients, []),
              instructions: safeParseJson(meal.instructions, []),
              alternatives: safeParseJson(meal.alternatives, [])
            };
          } catch (parseError) {
            console.error('Error parsing meal data:', parseError, meal);
            return {
              id: meal.id,
              weekly_plan_id: meal.weekly_plan_id,
              day_number: meal.day_number,
              meal_type: meal.meal_type,
              name: meal.name,
              calories: meal.calories || 0,
              protein: meal.protein || 0,
              carbs: meal.carbs || 0,
              fat: meal.fat || 0,
              prep_time: meal.prep_time || 0,
              cook_time: meal.cook_time || 0,
              servings: meal.servings || 1,
              youtube_search_term: meal.youtube_search_term,
              image_url: meal.image_url,
              recipe_fetched: meal.recipe_fetched || false,
              ingredients: [],
              instructions: [],
              alternatives: []
            };
          }
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
    staleTime: 0, // Always fetch fresh data
    gcTime: 2000, // Short cache time
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};
