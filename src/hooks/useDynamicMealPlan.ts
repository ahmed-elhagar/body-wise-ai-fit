
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

export const useDynamicMealPlan = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const { data: currentWeekPlan, isLoading, refetch } = useQuery({
    queryKey: ['weekly-meal-plan', user?.id, weekOffset],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useDynamicMealPlan - No user ID for meal plan fetch');
        return null;
      }
      
      // Verify session is valid
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== user.id) {
        console.error('❌ useDynamicMealPlan - Session mismatch or expired');
        throw new Error('Authentication required');
      }
      
      // Use STANDARDIZED week calculation
      const weekStartDate = getWeekStartDate(weekOffset).toISOString().split('T')[0];
      console.log('🔍 MEAL PLAN FETCH - USING STANDARDIZED CALCULATION:', {
        userId: user.id,
        userEmail: user.email,
        weekOffset,
        weekStartDate,
        today: new Date().toISOString().split('T')[0]
      });
      
      const { data: weeklyPlan, error: weeklyError } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      if (weeklyError) {
        console.error('❌ useDynamicMealPlan - Error fetching weekly plan:', weeklyError);
        return null;
      }

      if (!weeklyPlan) {
        console.log('🔍 NO MEAL PLAN FOUND - Debugging for user:', user.id);
        
        // Debug: Check what meal plans exist for this user
        const { data: allPlans } = await supabase
          .from('weekly_meal_plans')
          .select('id, week_start_date, created_at, user_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        console.log('🔍 All meal plans for user:', {
          searchedDate: weekStartDate,
          userPlans: allPlans?.map(p => ({ 
            id: p.id, 
            week_start_date: p.week_start_date, 
            created_at: p.created_at,
            user_id: p.user_id 
          }))
        });
        
        return null;
      }

      // CRITICAL: Double check user isolation
      if (weeklyPlan.user_id !== user.id) {
        console.error('🚨 CRITICAL: Meal plan user mismatch!', {
          planUserId: weeklyPlan.user_id,
          currentUserId: user.id,
          currentUserEmail: user.email
        });
        throw new Error('Data integrity violation - meal plan user mismatch');
      }

      console.log('✅ Found meal plan:', {
        planId: weeklyPlan.id,
        weekStartDate: weeklyPlan.week_start_date,
        totalCalories: weeklyPlan.total_calories,
        userId: weeklyPlan.user_id
      });

      // Fetch meals with additional user verification
      const { data: dailyMeals, error: mealsError } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('weekly_plan_id', weeklyPlan.id)
        .order('day_number', { ascending: true })
        .order('meal_type', { ascending: true });

      if (mealsError) {
        console.error('❌ useDynamicMealPlan - Error fetching daily meals:', mealsError);
        return null;
      }

      console.log('✅ Found daily meals:', {
        count: dailyMeals?.length || 0,
        planId: weeklyPlan.id,
        meals: dailyMeals?.map(m => ({ 
          id: m.id,
          day: m.day_number, 
          type: m.meal_type, 
          name: m.name 
        }))
      });

      // Verify all meals belong to the current user's plan
      if (dailyMeals && dailyMeals.length > 0) {
        const invalidMeal = dailyMeals.find(meal => meal.weekly_plan_id !== weeklyPlan.id);
        if (invalidMeal) {
          console.error('🚨 CRITICAL: Invalid meal found in results!', invalidMeal);
          throw new Error('Data integrity violation - invalid meal data');
        }
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

      console.log('✅ MEAL PLAN LOADED SUCCESSFULLY:', {
        userId: user.id,
        userEmail: user.email,
        planId: weeklyPlan.id,
        mealsCount: processedMeals.length,
        weekStartDate: weeklyPlan.week_start_date,
        searchedDate: weekStartDate
      });

      return {
        weeklyPlan: weeklyPlan as WeeklyMealPlan,
        dailyMeals: processedMeals
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // Reduced to 1 minute for testing
    cacheTime: 1000 * 60 * 2, // 2 minutes cache
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('Authentication required') || 
          error?.message?.includes('Data integrity violation')) {
        return false;
      }
      return failureCount < 1;
    },
  });

  return {
    currentWeekPlan,
    isLoading,
    refetch,
    getWeekStartDate: (offset: number) => getWeekStartDate(offset)
  };
};
