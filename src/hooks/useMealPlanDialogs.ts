
import { useState } from 'react';
import type { DailyMeal } from './meal-plan/types';

export const useMealPlanDialogs = () => {
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showShoppingDialog, setShowShoppingDialog] = useState(false);
  const [showExchangeDialog, setShowExchangeDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(-1);

  const [aiPreferences, setAiPreferences] = useState({
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
    cuisinePreferences: [] as string[],
    includeSnacks: true,
    language: 'en'
  });

  const closeAllDialogs = () => {
    setShowAIDialog(false);
    setShowRecipeDialog(false);
    setShowShoppingDialog(false);
    setShowExchangeDialog(false);
    setSelectedMeal(null);
    setSelectedMealIndex(-1);
  };

  return {
    showAIDialog,
    setShowAIDialog,
    showRecipeDialog,
    setShowRecipeDialog,
    showShoppingDialog,
    setShowShoppingDialog,
    showExchangeDialog,
    setShowExchangeDialog,
    selectedMeal,
    setSelectedMeal,
    selectedMealIndex,
    setSelectedMealIndex,
    aiPreferences,
    setAiPreferences,
    closeAllDialogs
  };
};
