
import { useState } from 'react';
import type { DailyMeal, MealPlanPreferences } from '@/features/meal-plan/types';

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
    console.log('🍽️ Opening recipe dialog for:', meal.name);
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const openExchangeDialog = (meal: DailyMeal, index?: number) => {
    console.log('🔄 Opening exchange dialog for:', meal.name);
    setSelectedMeal(meal);
    setSelectedMealIndex(index || 0);
    setShowExchangeDialog(true);
  };

  const closeExchangeDialog = () => {
    console.log('❌ Closing exchange dialog');
    setShowExchangeDialog(false);
    setSelectedMeal(null);
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
    closeExchangeDialog,
    closeAllDialogs
  };
};
