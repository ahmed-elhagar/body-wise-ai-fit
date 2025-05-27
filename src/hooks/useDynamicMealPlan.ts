
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

      // Parse ingredients if they're stored as JSON strings
      const processedMeals = (dailyMeals || []).map(meal => ({
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
      })) as DailyMeal[];

      return {
        weeklyPlan: weeklyPlan as WeeklyMealPlan,
        dailyMeals: processedMeals
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
