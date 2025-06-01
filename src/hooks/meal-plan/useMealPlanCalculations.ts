
import { useMemo } from 'react';
import type { DailyMeal, ShoppingItem } from '@/types/mealPlan';
import { getCategoryForIngredient } from '@/utils/mealPlanUtils';

export const useMealPlanCalculations = (
  mealPlanData: any,
  selectedDayNumber: number
) => {
  const dailyMeals = useMemo(() => {
    if (!mealPlanData?.dailyMeals) return [];
    return mealPlanData.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === selectedDayNumber
    );
  }, [mealPlanData?.dailyMeals, selectedDayNumber]);

  const todaysMeals = useMemo(() => {
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    
    if (!mealPlanData?.dailyMeals) return [];
    return mealPlanData.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === todayDayNumber
    );
  }, [mealPlanData?.dailyMeals]);

  const totalCalories = useMemo(() => {
    return dailyMeals.reduce((sum: number, meal: DailyMeal) => sum + (meal.calories || 0), 0);
  }, [dailyMeals]);

  const totalProtein = useMemo(() => {
    return dailyMeals.reduce((sum: number, meal: DailyMeal) => sum + (meal.protein || 0), 0);
  }, [dailyMeals]);

  const targetDayCalories = useMemo(() => {
    if (!mealPlanData?.weeklyPlan?.total_calories) return 2000;
    return Math.round(mealPlanData.weeklyPlan.total_calories / 7);
  }, [mealPlanData?.weeklyPlan?.total_calories]);

  const shoppingItems = useMemo((): ShoppingItem[] => {
    if (!mealPlanData?.dailyMeals) return [];
    
    const ingredients: ShoppingItem[] = [];
    mealPlanData.dailyMeals.forEach((meal: DailyMeal) => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          // Safely handle ingredient name
          const ingredientName = ingredient?.name || ingredient;
          if (ingredientName && typeof ingredientName === 'string') {
            ingredients.push({
              name: ingredientName,
              quantity: ingredient.quantity || '1',
              unit: ingredient.unit || 'piece',
              category: getCategoryForIngredient(ingredientName)
            });
          }
        });
      }
    });
    
    return ingredients;
  }, [mealPlanData?.dailyMeals]);

  return {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    shoppingItems
  };
};
