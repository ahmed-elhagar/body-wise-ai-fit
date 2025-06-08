
import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from '@/hooks/useMealPlanData';
import { useMealPlanActions } from '@/hooks/useMealPlanActions';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';
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

  // Debug the data flow
  React.useEffect(() => {
    console.log('🔄 useMealPlanState data update:', {
      weekOffset: currentWeekOffset,
      isLoading,
      hasData: !!currentWeekPlan,
      dataStructure: currentWeekPlan ? {
        hasWeeklyPlan: !!currentWeekPlan.weeklyPlan,
        weeklyPlanId: currentWeekPlan.weeklyPlan?.id,
        mealsCount: currentWeekPlan.dailyMeals?.length || 0,
        meals: currentWeekPlan.dailyMeals?.slice(0, 3).map(m => ({
          id: m.id,
          name: m.name,
          day: m.day_number,
          type: m.meal_type
        }))
      } : null,
      error: error?.message
    });
  }, [currentWeekPlan, isLoading, error, currentWeekOffset]);

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

  // Enhanced calculations - inline to avoid external dependencies
  const { dailyMeals, todaysMeals, totalCalories, totalProtein, targetDayCalories } = useMemo(() => {
    console.log('🧮 Calculating meal stats:', {
      selectedDayNumber,
      currentWeekPlan: !!currentWeekPlan,
      dailyMealsArray: currentWeekPlan?.dailyMeals?.length || 0
    });

    // Calculate daily meals for selected day
    const dailyMeals = currentWeekPlan?.dailyMeals?.filter(
      meal => meal.day_number === selectedDayNumber
    ) || [];

    console.log('📊 Daily meals for day', selectedDayNumber, ':', {
      count: dailyMeals.length,
      meals: dailyMeals.map(m => ({ name: m.name, type: m.meal_type, calories: m.calories }))
    });

    // Calculate today's meals
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    const todaysMeals = currentWeekPlan?.dailyMeals?.filter(
      meal => meal.day_number === todayDayNumber
    ) || [];

    // Calculate total calories for selected day
    const totalCalories = dailyMeals.reduce((total, meal) => total + (meal.calories || 0), 0);

    // Calculate total protein for selected day
    const totalProtein = dailyMeals.reduce((total, meal) => total + (meal.protein || 0), 0);

    // Target calories
    const targetDayCalories = 2000;

    const result = {
      dailyMeals,
      todaysMeals,
      totalCalories,
      totalProtein,
      targetDayCalories
    };

    console.log('✅ Calculated stats:', result);

    return result;
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber]);

  // Dialog states
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);

  // Selected items
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);

  // AI preferences state
  const [aiPreferences, setAiPreferences] = useState({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner",
  });

  // Actions
  const { handleGenerateAIPlan, isGenerating } = useMealPlanActions(
    currentWeekPlan,
    currentWeekOffset,
    aiPreferences,
    refetch
  );

  // Enhanced week change handler
  const setCurrentWeekOffset = useCallback(async (newOffset: number) => {
    console.log('📅 Changing week from', currentWeekOffset, 'to', newOffset);
    setCurrentWeekOffsetInternal(newOffset);
  }, [currentWeekOffset]);

  // Dialog handlers
  const openAIDialog = useCallback(() => setShowAIDialog(true), []);
  const closeAIDialog = useCallback(() => setShowAIDialog(false), []);
  
  const openRecipeDialog = useCallback((meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  }, []);
  const closeRecipeDialog = useCallback(() => {
    setSelectedMeal(null);
    setShowRecipeDialog(false);
  }, []);

  const openExchangeDialog = useCallback((meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowExchangeDialog(true);
  }, []);
  const closeExchangeDialog = useCallback(() => {
    setSelectedMeal(null);
    setShowExchangeDialog(false);
  }, []);

  const openAddSnackDialog = useCallback(() => setShowAddSnackDialog(true), []);
  const closeAddSnackDialog = useCallback(() => setShowAddSnackDialog(false), []);

  const openShoppingListDialog = useCallback(() => setShowShoppingListDialog(true), []);
  const closeShoppingListDialog = useCallback(() => setShowShoppingListDialog(false), []);

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
    
    // Navigation
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate,
    
    // Loading states
    isLoading,
    error,
    isGenerating,
    
    // Centralized credits
    userCredits,
    isPro,
    hasCredits,
    
    // Dialog states
    showAIDialog,
    showRecipeDialog,
    showExchangeDialog,
    showAddSnackDialog,
    showShoppingListDialog,
    
    // Selected items
    selectedMeal,
    selectedMealIndex,
    
    // AI preferences
    aiPreferences,
    updateAIPreferences,
    
    // Actions
    refetch,
    handleGenerateAIPlan,
    
    // Dialog handlers
    openAIDialog,
    closeAIDialog,
    openRecipeDialog,
    closeRecipeDialog,
    openExchangeDialog,
    closeExchangeDialog,
    openAddSnackDialog,
    closeAddSnackDialog,
    openShoppingListDialog,
    closeShoppingListDialog,
  };
};
