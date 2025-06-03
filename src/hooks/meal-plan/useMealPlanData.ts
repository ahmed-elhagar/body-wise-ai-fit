
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { useEnhancedErrorHandling } from '../useEnhancedErrorHandling';
import { formatWeekStartDate } from '@/utils/mealPlanUtils';
import { fetchMealPlanData, validateMealPlanExists } from '../../features/meal-plan/services/mealPlanService';

// Re-export types for backward compatibility - use the main types from features
export type { MealIngredient, DailyMeal, WeeklyMealPlan } from '@/features/meal-plan/types';

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
        const weekStartDateStr = formatWeekStartDate(weekOffset);
        
        console.log('🔍 STARTING MEAL PLAN FETCH:', {
          userId: user.id.substring(0, 8) + '...',
          weekOffset,
          weekStartDateStr,
          timestamp: new Date().toISOString()
        });
        
        // First validate if data exists
        const exists = await validateMealPlanExists(user.id, weekStartDateStr);
        
        if (!exists) {
          console.log('⚠️ No meal plan exists for this week, returning null');
          return null;
        }
        
        // Use enhanced API timeout handling
        const result = await handleAPITimeout(async () => {
          return await fetchMealPlanData(user.id, weekStartDateStr);
        }, 15000, 1); // 15 second timeout, 1 retry

        console.log('✅ MEAL PLAN FETCH COMPLETED:', {
          hasResult: !!result,
          hasWeeklyPlan: !!result?.weeklyPlan,
          dailyMealsCount: result?.dailyMeals?.length || 0,
          weekStartDate: result?.weeklyPlan?.week_start_date
        });

        return result;
      } catch (error) {
        console.error('❌ MEAL PLAN FETCH ERROR:', error);
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
    staleTime: 10000, // 10 seconds - shorter for better reactivity
    gcTime: 60000, // 1 minute
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};
