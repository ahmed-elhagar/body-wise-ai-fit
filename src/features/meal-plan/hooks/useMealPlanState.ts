
import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from './useMealPlanData';
import { useMealPlanActions } from './useMealPlanActions';
import { useMealPlanNavigation } from './useMealPlanNavigation';
import { useMealPlanDialogs } from './useMealPlanDialogs';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

export const useMealPlanState = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();
  
  // Use focused navigation hook
  const navigation = useMealPlanNavigation();
  
  // Use focused dialogs hook
  const dialogs = useMealPlanDialogs();

  // Core meal plan data
  const {
    data: currentWeekPlan,
    isLoading,
    error,
    refetch: originalRefetch,
  } = useMealPlanData(navigation.currentWeekOffset);

  // Enhanced refetch that properly invalidates and refreshes data
  const refetch = useCallback(async () => {
    console.log('🔄 Enhanced refetch - invalidating all meal plan queries for week offset:', navigation.currentWeekOffset);
    
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
  }, [queryClient, navigation.currentWeekOffset, originalRefetch]);

  // Enhanced calculations
  const { dailyMeals, todaysMeals, totalCalories, totalProtein, targetDayCalories } = useMemo(() => {
    // Calculate daily meals for selected day
    const dailyMeals = currentWeekPlan?.dailyMeals?.filter(
      meal => meal.day_number === navigation.selectedDayNumber
    ) || null;

    // Calculate today's meals
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    const todaysMeals = currentWeekPlan?.dailyMeals?.filter(
      meal => meal.day_number === todayDayNumber
    ) || null;

    // Calculate total calories for selected day
    const totalCalories = dailyMeals ? 
      dailyMeals.reduce((total, meal) => total + (meal.calories || 0), 0) : null;

    // Calculate total protein for selected day
    const totalProtein = dailyMeals ? 
      dailyMeals.reduce((total, meal) => total + (meal.protein || 0), 0) : null;

    // Target calories
    const targetDayCalories = 2000;

    return {
      dailyMeals,
      todaysMeals,
      totalCalories,
      totalProtein,
      targetDayCalories
    };
  }, [currentWeekPlan?.dailyMeals, navigation.selectedDayNumber]);

  // AI preferences state
  const [aiPreferences, setAiPreferences] = useState({
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
  });

  // Actions with proper dialog handling
  const { handle: handleGenerateAIPlan, isGenerating } = useMealPlanActions(
    currentWeekPlan,
    navigation.currentWeekOffset,
    aiPreferences,
    refetch
  );

  // Enhanced AI generation handler that closes dialog on success
  const handleAIGeneration = useCallback(async () => {
    const success = await handleGenerateAIPlan();
    if (success) {
      dialogs.closeAIDialog(); // Close dialog on success
    }
  }, [handleGenerateAIPlan, dialogs.closeAIDialog]);

  const updateAIPreferences = useCallback((newPrefs: any) => {
    setAiPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  return {
    // Data
    currentWeekPlan,
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Navigation - spread from navigation hook
    ...navigation,
    
    // Loading states
    isLoading,
    error,
    isGenerating,
    
    // Centralized credits
    userCredits,
    isPro,
    hasCredits,
    
    // Dialog states - spread from dialogs hook
    ...dialogs,
    
    // AI preferences
    aiPreferences,
    updateAIPreferences,
    
    // Actions
    refetch,
    handleGenerateAIPlan: handleAIGeneration, // Use enhanced handler
  };
};
