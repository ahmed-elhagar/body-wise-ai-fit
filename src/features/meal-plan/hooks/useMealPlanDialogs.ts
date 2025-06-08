
import { useState } from 'react';
import type { DailyMeal } from '@/hooks/useMealPlanData';

export const useMealPlanDialogs = () => {
  const [selectedMeal, setSelectedMeal] = useState<DailyMeal | null>(null);
  const [showRecipeDialog, setShowRecipeDialog] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [showShoppingListDialog, setShowShoppingListDialog] = useState(false);
  const [exchangeMeal, setExchangeMeal] = useState<DailyMeal | null>(null);

  const handleShowRecipe = (meal: DailyMeal) => {
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  };

  const handleExchangeMeal = (meal: DailyMeal) => {
    setExchangeMeal(meal);
    // You can add exchange logic here
  };

  const handleShowAI = () => {
    setShowAIDialog(true);
  };

  const handleShowShoppingList = () => {
    setShowShoppingListDialog(true);
  };

  const closeRecipeDialog = () => {
    setShowRecipeDialog(false);
    setSelectedMeal(null);
  };

  const closeAIDialog = () => {
    setShowAIDialog(false);
  };

  const closeShoppingListDialog = () => {
    setShowShoppingListDialog(false);
  };

  return {
    selectedMeal,
    showRecipeDialog,
    showAIDialog,
    showShoppingListDialog,
    exchangeMeal,
    handleShowRecipe,
    handleExchangeMeal,
    handleShowAI,
    handleShowShoppingList,
    closeRecipeDialog,
    closeAIDialog,
    closeShoppingListDialog,
  };
};
