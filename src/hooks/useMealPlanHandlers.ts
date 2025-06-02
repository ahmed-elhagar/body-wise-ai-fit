import { useCallback } from "react";
import type { DailyMeal } from "@/features/meal-plan/types";

export const useMealPlanHandlers = (
  openRecipeDialog: (meal: DailyMeal) => void,
  openExchangeDialog: (meal: DailyMeal, index?: number) => void
) => {
  const handleViewMeal = useCallback((meal: DailyMeal) => {
    console.log('👁️ Viewing meal details:', meal.name);
    openRecipeDialog(meal);
  }, [openRecipeDialog]);

  const handleExchangeMeal = useCallback((meal: DailyMeal, index = 0) => {
    console.log('🔄 Exchanging meal:', meal.name, 'at index:', index);
    openExchangeDialog(meal, index);
  }, [openExchangeDialog]);

  const handleShowRecipe = useCallback((meal: DailyMeal) => {
    console.log('🍽️ Showing recipe for meal:', meal.name);
    openRecipeDialog(meal);
  }, [openRecipeDialog]);

  return {
    handleViewMeal,
    handleExchangeMeal,
    handleShowRecipe
  };
};
