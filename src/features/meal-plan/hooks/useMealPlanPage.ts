
import { useState, useMemo } from 'react';
import { useDynamicMealPlan } from '@/hooks/useDynamicMealPlan';
import { useMealPlanActions } from './useMealPlanActions';
import { format, startOfWeek, addWeeks } from 'date-fns';
import type { DailyMeal } from '../types';

export const useMealPlanPage = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dialog states
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  
  // AI preferences
  const [aiPreferences, setAiPreferences] = useState({});

  // Get current week data
  const { currentWeekPlan, isLoading, error, refetch } = useDynamicMealPlan(currentWeekOffset);

  // Calculate week start date
  const weekStartDate = useMemo(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
    return addWeeks(currentWeekStart, currentWeekOffset);
  }, [currentWeekOffset]);

  // Get daily meals for selected day
  const dailyMeals = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(meal => meal.day_number === selectedDayNumber);
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber]);

  // Calculate nutrition totals
  const totalCalories = useMemo(() => {
    return dailyMeals.reduce((total, meal) => total + (meal.calories || 0), 0);
  }, [dailyMeals]);

  const totalProtein = useMemo(() => {
    return dailyMeals.reduce((total, meal) => total + (meal.protein || 0), 0);
  }, [dailyMeals]);

  const targetDayCalories = 2000; // Default target

  // Action handlers using meal plan actions hook
  const mealPlanActions = useMealPlanActions(
    currentWeekPlan,
    currentWeekOffset,
    aiPreferences,
    refetch
  );

  // Dialog handlers
  const openAIDialog = () => setShowAIDialog(true);
  const closeAIDialog = () => setShowAIDialog(false);
  
  const openRecipeDialog = (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };
  const closeRecipeDialog = () => {
    setSelectedMeal(null);
    setShowRecipeDialog(false);
  };
  
  const openExchangeDialog = (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowExchangeDialog(true);
  };
  const closeExchangeDialog = () => {
    setSelectedMeal(null);
    setShowExchangeDialog(false);
  };
  
  const openAddSnackDialog = () => setShowAddSnackDialog(true);
  const closeAddSnackDialog = () => setShowAddSnackDialog(false);
  
  const openShoppingListDialog = () => setShowShoppingListDialog(true);
  const closeShoppingListDialog = () => setShowShoppingListDialog(false);

  const updateAIPreferences = (newPreferences: any) => {
    setAiPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  // AI generation handler
  const handleGenerateAIPlan = async () => {
    setIsGenerating(true);
    try {
      await mealPlanActions.handleGenerateAIPlan();
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    // Core data
    currentWeekPlan,
    isLoading,
    error,
    refetch,
    
    // Week navigation
    currentWeekOffset,
    setCurrentWeekOffset,
    weekStartDate,
    
    // Day selection
    selectedDayNumber,
    setSelectedDayNumber,
    
    // Daily meals data
    dailyMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    
    // Generation state
    isGenerating,
    
    // Dialog states
    showAIDialog,
    showRecipeDialog,
    showExchangeDialog,
    showAddSnackDialog,
    showShoppingListDialog,
    selectedMeal,
    
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
    
    // AI preferences
    aiPreferences,
    updateAIPreferences,
    
    // Actions
    handleGenerateAIPlan,
    ...mealPlanActions
  };
};
