
import { useCallback } from "react";
import type { DailyMeal } from "@/hooks/useMealPlanData";

export const useMealPlanHandlers = (
  setSelectedMeal: (meal: DailyMeal | null) => void,
  setSelectedMealIndex: (index: number) => void,
  setShowRecipeDialog: (show: boolean) => void,
  setShowExchangeDialog: (show: boolean) => void
) => {
  const handleShowRecipe = useCallback((meal: DailyMeal) => {
    console.log('🍽️ Showing recipe for meal:', meal.name);
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  }, [setSelectedMeal, setShowRecipeDialog]);

  const handleExchangeMeal = useCallback((meal: DailyMeal, index: number) => {
    console.log('🔄 Exchanging meal:', meal.name, 'at index:', index);
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  }, [setSelectedMeal, setSelectedMealIndex, setShowExchangeDialog]);

  const handleRecipeGenerated = useCallback(() => {
    console.log('✅ Recipe generated successfully');
    setShowRecipeDialog(false);
    setSelectedMeal(null);
  }, [setShowRecipeDialog, setSelectedMeal]);

  return {
    handleShowRecipe,
    handleExchangeMeal,
    handleRecipeGenerated
  };
};
