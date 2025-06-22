
import { useState } from 'react';
import type { AIPreferences } from '@/features/meal-plan/types';

export const useMealPlanDialogs = () => {
  // Dialog states
  const [isAIPreferencesOpen, setIsAIPreferencesOpen] = useState(false);
  const [isCalorieAdjustmentOpen, setIsCalorieAdjustmentOpen] = useState(false);
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [selectedMealForExchange, setSelectedMealForExchange] = useState<any>(null);
  const [selectedDayForSnack, setSelectedDayForSnack] = useState<number | null>(null);
  const [isShoppingListDialogOpen, setIsShoppingListDialogOpen] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // AI Preferences state - using default values to avoid type errors
  const [aiPreferences, setAIPreferences] = useState<AIPreferences>({
    cuisine: 'mixed',
    complexity: 'medium',
    dietaryRestrictions: [],
    excludedFoods: [],
    preferredFoods: [],
    mealTypes: ['breakfast', 'lunch', 'dinner'],
    maxCookTime: 60,
    servings: 2,
    budgetLevel: 'medium',
    nutritionFocus: 'balanced'
  });

  // Dialog handlers
  const openAIPreferences = () => setIsAIPreferencesOpen(true);
  const closeAIPreferences = () => setIsAIPreferencesOpen(false);
  
  const openCalorieAdjustment = () => setIsCalorieAdjustmentOpen(true);
  const closeCalorieAdjustment = () => setIsCalorieAdjustmentOpen(false);
  
  const openMealExchange = (meal: any) => setSelectedMealForExchange(meal);
  const closeMealExchange = () => setSelectedMealForExchange(null);
  
  const openSnackDialog = (dayNumber: number) => setSelectedDayForSnack(dayNumber);
  const closeSnackDialog = () => setSelectedDayForSnack(null);
  
  const openShoppingList = () => setIsShoppingListDialogOpen(true);
  const closeShoppingList = () => setIsShoppingListDialogOpen(false);
  
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorDialog(true);
  };
  
  const hideError = () => {
    setShowErrorDialog(false);
    setErrorMessage('');
  };

  return {
    // States
    isAIPreferencesOpen,
    isCalorieAdjustmentOpen,
    isGeneratingMealPlan,
    selectedMealForExchange,
    selectedDayForSnack,
    isShoppingListDialogOpen,
    showErrorDialog,
    errorMessage,
    aiPreferences,
    
    // Setters
    setIsGeneratingMealPlan,
    setAIPreferences,
    
    // Handlers
    openAIPreferences,
    closeAIPreferences,
    openCalorieAdjustment,
    closeCalorieAdjustment,
    openMealExchange,
    closeMealExchange,
    openSnackDialog,
    closeSnackDialog,
    openShoppingList,
    closeShoppingList,
    showError,
    hideError,
  };
};
