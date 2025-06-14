import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from './useMealPlanData';
import { useMealPlanActions } from './useMealPlanActions';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';
import { useMealPlanDialogs } from './useMealPlanDialogs';
import { useMealPlanCalculations } from './useMealPlanCalculations';
import type { DailyMeal, MealPlanFetchResult } from '@/features/meal-plan/types';

export const useMealPlanState = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();
  
  // Navigation state
  const [currentWeekOffset, setCurrentWeekOffsetInternal] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => getCurrentSaturdayDay());
  
  const weekStartDate = useMemo(() => getWeekStartDate(currentWeekOffset), [currentWeekOffset]);

  // Core meal plan data
  const {
    data: currentWeekPlan,
    isLoading,
    error,
    refetch: originalRefetch,
  } = useMealPlanData(currentWeekOffset);

  // Enhanced refetch that properly invalidates and refreshes data
  const refetch = useCallback(async () => {
    console.log('🔄 Enhanced refetch - invalidating all meal plan queries for week offset:', currentWeekOffset);
    
    // Clear all meal plan related caches
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey[0] === 'weekly-meal-plan' || 
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
  }, [queryClient, currentWeekOffset, originalRefetch]);

  // Use the new hook for all nutritional calculations
  const { dailyMeals, todaysMeals, totalCalories, totalProtein, targetDayCalories } =
    useMealPlanCalculations(currentWeekPlan, selectedDayNumber);

  // Use the dedicated hook for all dialog-related state and handlers
  const dialogs = useMealPlanDialogs();

  // Actions - AI preferences are now taken from the dialogs hook
  const { handleGenerateAIPlan, isGenerating } = useMealPlanActions(
    currentWeekPlan,
    currentWeekOffset,
    dialogs.aiPreferences,
    refetch
  );

  // Enhanced week change handler
  const setCurrentWeekOffset = useCallback(async (newOffset: number) => {
    console.log('📅 Changing week from', currentWeekOffset, 'to', newOffset);
    setCurrentWeekOffsetInternal(newOffset);
  }, [currentWeekOffset]);

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
    
    // Centralized credits
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
