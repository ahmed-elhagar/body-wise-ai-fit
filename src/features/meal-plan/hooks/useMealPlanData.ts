
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useEnhancedErrorHandling } from '@/shared/hooks/useEnhancedErrorHandling';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { format } from 'date-fns';
import { fetchMealPlanData } from '../services/mealPlanService';

// Re-export types for backward compatibility - use the main types from features
export type { MealIngredient, DailyMeal, WeeklyMealPlan } from '@/features/meal-plan/types';

export const useMealPlanData = (weekOffset: number = 0) => {
  const { user } = useAuth();
  const { handleError, handleAPITimeout } = useEnhancedErrorHandling();

  // Create a stable query key to prevent infinite loops
  const queryKey = ['weekly-meal-plan', user?.id, weekOffset];

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useMealPlanData - No user ID for meal plan fetch');
        return null;
      }
      
      try {
        // Calculate date only once and cache it
        const weekStartDate = getWeekStartDate(weekOffset);
        const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');
        
        console.log('🔍 Fetching meal plan data:', {
          userId: user.id.substring(0, 8) + '...',
          weekOffset,
          weekStartDate: weekStartDateStr
        });
        
        // Use enhanced API timeout handling
        const result = await handleAPITimeout(async () => {
          return await fetchMealPlanData(user.id, weekStartDateStr);
        }, 15000, 1); // 15 second timeout, 1 retry

        console.log('✅ Meal plan data fetched:', {
          hasWeeklyPlan: !!result?.weeklyPlan,
          dailyMealsCount: result?.dailyMeals?.length || 0
        });

        return result;
      } catch (error) {
        console.error('❌ Error in useMealPlanData:', error);
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
