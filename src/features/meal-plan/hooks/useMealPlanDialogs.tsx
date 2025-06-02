
import { useState } from 'react';
import type { DailyMeal, MealPlanPreferences } from '../types';

export const useMealPlanDialogs = () => {
  const [dialogs, setDialogs] = useState({
    showAIDialog: false,
    showRecipeDialog: false,
    showExchangeDialog: false,
    showAddSnackDialog: false,
    showShoppingListDialog: false,
    selectedMeal: null as DailyMeal | null,
    selectedMealIndex: 0,
    aiPreferences: {
      duration: "7",
      cuisine: "mixed",
      maxPrepTime: "30",
      includeSnacks: true,
      mealTypes: "breakfast,lunch,dinner"
    } as MealPlanPreferences
  });

  // Dialog actions
  const openAIDialog = () => setDialogs(prev => ({ ...prev, showAIDialog: true }));
  const closeAIDialog = () => setDialogs(prev => ({ ...prev, showAIDialog: false }));
  
  const openRecipeDialog = (meal: DailyMeal) => {
    setDialogs(prev => ({ ...prev, selectedMeal: meal, showRecipeDialog: true }));
  };
  
  const closeRecipeDialog = () => setDialogs(prev => ({ 
    ...prev, 
    showRecipeDialog: false, 
    selectedMeal: null 
  }));
  
  const openExchangeDialog = (meal: DailyMeal, index = 0) => {
    setDialogs(prev => ({ 
      ...prev, 
      selectedMeal: meal, 
      selectedMealIndex: index, 
      showExchangeDialog: true 
    }));
  };

  const closeExchangeDialog = () => setDialogs(prev => ({ 
    ...prev, 
    showExchangeDialog: false, 
    selectedMeal: null 
  }));

  const openAddSnackDialog = () => setDialogs(prev => ({ ...prev, showAddSnackDialog: true }));
  const closeAddSnackDialog = () => setDialogs(prev => ({ ...prev, showAddSnackDialog: false }));

  const openShoppingListDialog = () => setDialogs(prev => ({ ...prev, showShoppingListDialog: true }));
  const closeShoppingListDialog = () => setDialogs(prev => ({ ...prev, showShoppingListDialog: false }));

  const updateAIPreferences = (newPreferences: MealPlanPreferences) => {
    setDialogs(prev => ({ ...prev, aiPreferences: newPreferences }));
  };

  const handleAddSnack = () => setDialogs(prev => ({ ...prev, showAddSnackDialog: true }));

  return {
    // Dialog states
    ...dialogs,
    setDialogs,
    
    // Actions
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
    updateAIPreferences,
    handleAddSnack
  };
};
