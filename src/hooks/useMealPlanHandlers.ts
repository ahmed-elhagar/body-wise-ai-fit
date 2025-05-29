
import { useCallback } from "react";
import { getCategoryForIngredient } from "@/utils/mealPlanUtils";
import type { Meal } from "@/types/meal";

export const useMealPlanHandlers = (
  setSelectedMeal: (meal: Meal | null) => void,
  setSelectedMealIndex: (index: number) => void,
  setShowRecipeDialog: (show: boolean) => void,
  setShowExchangeDialog: (show: boolean) => void
) => {
  const handleShowRecipe = useCallback((meal: Meal) => {
    console.log('🍳 Opening recipe for meal:', { id: meal.id, name: meal.name });
    setSelectedMeal(meal);
    setShowRecipeDialog(true);
  }, [setSelectedMeal, setShowRecipeDialog]);

  const handleExchangeMeal = useCallback((meal: Meal, index: number) => {
    setSelectedMeal(meal);
    setSelectedMealIndex(index);
    setShowExchangeDialog(true);
  }, [setSelectedMeal, setSelectedMealIndex, setShowExchangeDialog]);

  // Memoized shopping items conversion
  const convertMealsToShoppingItems = useCallback((meals: Meal[]) => {
    const items: any[] = [];
    meals.forEach(meal => {
      meal.ingredients.forEach((ingredient: any) => {
        items.push({
          name: ingredient.name || ingredient,
          quantity: ingredient.quantity || '1',
          unit: ingredient.unit || 'piece',
          category: getCategoryForIngredient(ingredient.name || ingredient)
        });
      });
    });
    return items;
  }, []);

  return {
    handleShowRecipe,
    handleExchangeMeal,
    convertMealsToShoppingItems
  };
};
