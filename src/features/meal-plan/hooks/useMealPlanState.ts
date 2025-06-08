
import { useState, useCallback, useMemo } from 'react';
import { useMealPlanData } from './useMealPlanData';
import { useMealPlanActions } from './useMealPlanActions';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';
import type { DailyMeal } from '../types';

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
    
    await queryClient.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return queryKey[0] === 'weekly-meal-plan' || 
               queryKey[0] === 'optimized-meal-plan' ||
               queryKey[0] === 'meal-plan';
      }
    });
    
    const result = await originalRefetch();
    
    if (!result.data?.weeklyPlan) {
      console.log('⏳ No data returned, waiting and retrying...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await originalRefetch();
    }
    
    return result;
  }, [queryClient, currentWeekOffset, originalRefetch]);

  // Enhanced calculations
  const { dailyMeals, todaysMeals, totalCalories, totalProtein, targetDayCalories } = useMemo(() => {
    const dailyMeals = currentWeekPlan?.dailyMeals?.filter(
      meal => meal.day_number === selectedDayNumber
    ) || null;

    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    const todaysMeals = currentWeekPlan?.dailyMeals?.filter(
      meal => meal.day_number === todayDayNumber
    ) || null;

    const totalCalories = dailyMeals ? 
      dailyMeals.reduce((total, meal) => total + (meal.calories || 0), 0) : null;

    const totalProtein = dailyMeals ? 
      dailyMeals.reduce((total, meal) => total + (meal.protein || 0), 0) : null;

    const targetDayCalories = 2000;

    return {
      dailyMeals,
      todaysMeals,
      totalCalories,
      totalProtein,
      targetDayCalories
    };
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
