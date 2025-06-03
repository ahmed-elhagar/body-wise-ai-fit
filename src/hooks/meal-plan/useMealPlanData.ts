
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { useEnhancedErrorHandling } from '../useEnhancedErrorHandling';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { format } from 'date-fns';
import { fetchMealPlanData } from '../../features/meal-plan/services/mealPlanService';

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
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
        
        console.log('🔍 useMealPlanData - Fetching data:', {
          userId: user.id.substring(0, 8) + '...',
          weekOffset,
          weekStartDate: weekStartDateStr,
          calculatedDate: weekStartDate.toISOString()
        });
        
        // Use enhanced API timeout handling
        const result = await handleAPITimeout(async () => {
          return await fetchMealPlanData(user.id, weekStartDateStr);
        }, 15000, 1); // 15 second timeout, 1 retry

        console.log('✅ useMealPlanData - Query result:', {
          hasData: !!result,
          hasWeeklyPlan: !!result?.weeklyPlan,
          dailyMealsCount: result?.dailyMeals?.length || 0,
          weekStartFromData: result?.weeklyPlan?.week_start_date
        });

        return result;
      } catch (error) {
        console.error('❌ useMealPlanData - Error:', error);
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
    staleTime: 0, // Always fetch fresh data for debugging
    gcTime: 30000, // 30 seconds cache time
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};
