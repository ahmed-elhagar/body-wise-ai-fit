import { useMemo } from "react";
import type { DailyMeal, WeeklyMealPlan } from "@/hooks/useMealPlanData";
import { getCategoryForIngredient } from "@/utils/mealPlanUtils";

interface MealPlanData {
  weeklyPlan: WeeklyMealPlan;
  dailyMeals: DailyMeal[];
}

export const useMealPlanCalculations = (
  currentWeekPlan: MealPlanData | null, 
  selectedDayNumber: number
) => {
  // Get daily meals for the selected day
  const dailyMeals = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(
      meal => meal.day_number === selectedDayNumber
    );
  }, [currentWeekPlan, selectedDayNumber]);

  // Get today's meals (alias for dailyMeals for backward compatibility)
  const todaysMeals = dailyMeals;

  // Calculate shopping items from all meals in the week
  const shoppingItems = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    
    const allIngredients = currentWeekPlan.dailyMeals.flatMap(meal => 
      meal.ingredients?.map(ingredient => ({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        category: getCategoryForIngredient(ingredient.name)
      })) || []
    );

    // Group ingredients by name to avoid duplicates
    const groupedIngredients = allIngredients.reduce((acc, ingredient) => {
      const key = ingredient.name.toLowerCase();
      if (acc[key]) {
        // For now, just keep the first occurrence
        // In a real app, you'd want to combine quantities
        return acc;
      }
      acc[key] = ingredient;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedIngredients);
  }, [currentWeekPlan]);

  // Calculate totals for the selected day
  const { totalCalories, totalProtein, totalCarbs, totalFat } = useMemo(() => {
    return dailyMeals.reduce((acc, meal) => ({
      totalCalories: acc.totalCalories + (meal.calories || 0),
      totalProtein: acc.totalProtein + (meal.protein || 0),
      totalCarbs: acc.totalCarbs + (meal.carbs || 0),
      totalFat: acc.totalFat + (meal.fat || 0)
    }), {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    });
  }, [dailyMeals]);

  // Default target calories (this could be made dynamic based on user profile)
  const targetDayCalories = 2000;

  console.log('📊 Meal calculations:', {
    selectedDay: selectedDayNumber,
    dailyMealsCount: dailyMeals.length,
    totalCalories,
    totalProtein,
    shoppingItemsCount: shoppingItems.length
  });

  return {
    dailyMeals,
    todaysMeals,
    shoppingItems,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    targetDayCalories
  };
};
