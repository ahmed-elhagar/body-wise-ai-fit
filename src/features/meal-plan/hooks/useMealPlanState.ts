
import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from './useMealPlanData';
import { useMealPlanActions } from './useMealPlanActions';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';
import { useMealPlanDialogs } from './useMealPlanDialogs';
import { useMealPlanCalculations } from './useMealPlanCalculations';

export const useMealPlanState = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Use credits directly from hook - simplified approach
  const userCredits = 5; // Default credits
  const isPro = false; // Default non-pro
  const hasCredits = userCredits > 0;
  
  // Navigation state - use stable initial values
  const [currentWeekOffset, setCurrentWeekOffsetInternal] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => getCurrentSaturdayDay());
  
  // Calculate week start date only when needed, memoized with error handling
  const weekStartDate = useMemo(() => {
    try {
      return getWeekStartDate(currentWeekOffset);
    } catch (error) {
      console.error('Error calculating week start date:', error);
      return new Date();
    }
  }, [currentWeekOffset]);

  // Core meal plan data - use the hook with stable weekOffset
  const mealPlanQuery = useMealPlanData(currentWeekOffset);
  const {
    data: currentWeekPlan,
    isLoading,
    error,
    refetch: originalRefetch,
  } = mealPlanQuery;

  // Enhanced refetch that properly invalidates and refreshes data
  const refetch = useCallback(async () => {
    console.log('🔄 Enhanced refetch - invalidating all meal plan queries for week offset:', currentWeekOffset);
    
    try {
      // Clear all meal plan related caches
      await queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey[0] === 'meal-plan-data' || 
                 queryKey[0] === 'weekly-meal-plan' ||
                 queryKey[0] === 'optimized-meal-plan' ||
                 queryKey[0] === 'meal-plan';
        }
      });
      
      // Clear the OptimizedMealPlanService cache
      try {
        const { OptimizedMealPlanService } = await import('@/features/meal-plan/services/optimizedMealPlanService');
        OptimizedMealPlanService.clearCache();
      } catch (e) {
        console.log('Service cache clear skipped:', e);
      }
      
      // Force refetch current data
      const result = await originalRefetch();
      
      // Wait a bit and try again if no data
      if (!result.data?.weeklyPlan) {
        console.log('⏳ No data returned, waiting and retrying...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await originalRefetch();
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error in refetch:', error);
      throw error;
    }
  }, [queryClient, currentWeekOffset, originalRefetch]);

  // Use the new hook for all nutritional calculations
  const { dailyMeals, todaysMeals, totalCalories, totalProtein, targetDayCalories } =
    useMealPlanCalculations(currentWeekPlan, selectedDayNumber);

  // Use the dedicated hook for all dialog-related state and handlers
  const dialogs = useMealPlanDialogs();

  // Enhanced week change handler - use useCallback to prevent unnecessary re-renders
  const setCurrentWeekOffset = useCallback((newOffset: number) => {
    console.log('📅 Changing week from', currentWeekOffset, 'to', newOffset);
    // Only update if the offset actually changed
    if (newOffset !== currentWeekOffset) {
      setCurrentWeekOffsetInternal(newOffset);
    }
  }, [currentWeekOffset]);

  // Actions - Create a stable reference to avoid circular dependencies
  const mealPlanActions = useMemo(() => {
    return {
      currentWeekPlan,
      currentWeekOffset,
      aiPreferences: dialogs.aiPreferences,
      refetch
    };
  }, [currentWeekPlan, currentWeekOffset, dialogs.aiPreferences, refetch]);

  // Use actions hook with stable reference
  const { handleGenerateAIPlan, isGenerating } = useMealPlanActions(
    mealPlanActions.currentWeekPlan,
    mealPlanActions.currentWeekOffset,
    mealPlanActions.aiPreferences,
    mealPlanActions.refetch
  );

  return {
    // Data
    currentWeekPlan,
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Navigation
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    
    // Loading states
    isLoading,
    error,
    
    // Simplified credits
    userCredits,
    isPro,
    hasCredits,
    
    // Actions
    refetch,
    handleGenerateAIPlan,
    isGenerating,
    
    // Spread all dialog states and handlers from the dedicated hook
    ...dialogs,
  };
};
