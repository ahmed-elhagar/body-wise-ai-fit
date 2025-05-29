
import { useMealPlanData } from './useMealPlanData';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { useCallback } from 'react';

export const useDynamicMealPlan = (weekOffset: number = 0) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: currentWeekPlan, isLoading, error, refetch } = useMealPlanData(weekOffset);

  // Enhanced refetch function that handles cache invalidation
  const enhancedRefetch = useCallback(async () => {
    console.log('🔄 Enhanced refetch triggered for week offset:', weekOffset);
    
    try {
      // Invalidate the specific query for this week
      await queryClient.invalidateQueries({
        queryKey: ['weekly-meal-plan', user?.id, weekOffset]
      });
      
      // Also invalidate nearby weeks to ensure consistency
      await queryClient.invalidateQueries({
        queryKey: ['weekly-meal-plan', user?.id]
      });
      
      // Force refetch
      return await refetch();
    } catch (error) {
      console.error('Enhanced refetch failed:', error);
      throw error;
    }
  }, [weekOffset, queryClient, user?.id, refetch]);

  return {
    currentWeekPlan,
    isLoading,
    error,
    refetch: enhancedRefetch,
    getWeekStartDate: (offset: number) => getWeekStartDate(offset)
  };
};

export type { MealIngredient, DailyMeal, WeeklyMealPlan } from './useMealPlanData';
