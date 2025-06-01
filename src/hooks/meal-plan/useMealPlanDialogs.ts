
import { useState } from 'react';
import type { DailyMeal, MealPlanPreferences } from '@/types/mealPlan';

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [showAddSnackDialog, setShowAddSnackDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);
  
  const [aiPreferences, setAiPreferences] = useState<MealPlanPreferences>({
    duration: "7",
    cuisine: "mixed",
    maxPrepTime: "30",
    includeSnacks: true,
    mealTypes: "breakfast,lunch,dinner"
  });

  const openRecipeDialog = (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const openExchangeDialog = (meal: DailyMeal, index?: number) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index || 0);
    setShowExchangeDialog(true);
  };

  const closeAllDialogs = () => {
    setShowAIDialog(false);
    setShowRecipeDialog(false);
    setShowExchangeDialog(false);
    setShowAddSnackDialog(false);
    setShowShoppingListDialog(false);
    setSelectedMeal(null);
  };

  return {
    // Dialog states
    showAIDialog,
    setShowAIDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    showAddSnackDialog,
    setShowAddSnackDialog,
    showShoppingListDialog,
    setShowShoppingListDialog,
    
    // Selected items
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex,
    setSelectedMealIndex,
    
    // AI preferences
    aiPreferences,
    setAiPreferences,
    
    // Helper methods
    openRecipeDialog,
    openExchangeDialog,
    closeAllDialogs
  };
};
