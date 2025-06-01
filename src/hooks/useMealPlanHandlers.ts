
import { useCallback } from 'react';
import type { DailyMeal } from './meal-plan/types';

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

  const handleAddSnack = useCallback(() => {
    console.log('🍪 Adding snack functionality');
    // Snack addition logic can be implemented here
  }, []);

  return {
    handleShowRecipe,
    handleExchangeMeal,
    handleAddSnack
  };
};
