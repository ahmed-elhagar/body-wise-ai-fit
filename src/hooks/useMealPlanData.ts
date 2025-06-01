
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEnhancedErrorHandling } from './useEnhancedErrorHandling';
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

export const useMealPlanData = (weekOffset: number = 0) => {
  const { user } = useAuth();
  const { handleError, handleAPITimeout } = useEnhancedErrorHandling();

  return useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekOffset],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useMealPlanData - No user ID for meal plan fetch');
        return null;
      }
      
      try {
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
        
        console.log('🎯 MEAL PLAN FETCH:', {
          userId: user.id.substring(0, 8) + '...',
          weekOffset,
          searchingForDate: weekStartDateStr
        });
        
        // Use enhanced API timeout handling
        const result = await handleAPITimeout(async () => {
          return await fetchMealPlanData(user.id, weekStartDateStr);
        }, 15000, 1); // 15 second timeout, 1 retry

        return result;
      } catch (error) {
        handleError(error, {
          operation: 'Meal Plan Fetch',
          userId: user.id,
          weekOffset,
          retryable: true
        });
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    gcTime: 120000, // 2 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};

const fetchMealPlanData = async (userId: string, weekStartDateStr: string) => {
  // Fetch weekly plan
  const { data: weeklyPlan, error: weeklyError } = await supabase
    .from('weekly_meal_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDateStr)
    .maybeSingle();

  if (weeklyError) {
    console.error('❌ Error fetching weekly plan:', weeklyError);
    throw weeklyError;
  }

  if (!weeklyPlan) {
    console.log('❌ NO MEAL PLAN FOUND for week:', weekStartDateStr);
    return null;
  }

  // Fetch meals for the plan
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

  console.log('✅ Found meals for week:', {
    planId: weeklyPlan.id,
    mealsCount: dailyMeals?.length || 0,
    weekStartDate: weeklyPlan.week_start_date
  });

  // Process meals data with safe JSON parsing
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
      // Return meal with safe defaults
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
    weeklyPlan: {
      id: weeklyPlan.id,
      user_id: weeklyPlan.user_id,
      week_start_date: weeklyPlan.week_start_date,
      total_calories: weeklyPlan.total_calories || 0,
      total_protein: weeklyPlan.total_protein || 0,
      total_carbs: weeklyPlan.total_carbs || 0,
      total_fat: weeklyPlan.total_fat || 0,
      generation_prompt: weeklyPlan.generation_prompt,
      created_at: weeklyPlan.created_at,
      life_phase_context: weeklyPlan.life_phase_context
    } as WeeklyMealPlan,
    dailyMeals: processedMeals
  };
};

// Enhanced JSON parsing with better error handling
const safeParseJson = (jsonField: any, fallback: any = []) => {
  if (Array.isArray(jsonField)) return jsonField;
  if (!jsonField) return fallback;
  
  if (typeof jsonField === 'string') {
    try {
      const parsed = JSON.parse(jsonField);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.warn('Failed to parse JSON field:', jsonField, error);
      return fallback;
    }
  }
  
  if (typeof jsonField === 'object') {
    return jsonField;
  }
  
  return fallback;
};
