
import { useMemo } from 'react';
import type { DailyMeal } from '@/hooks/useMealPlanData';

export const useMealPlanCalculations = (currentWeekPlan: any, selectedDayNumber: number) => {
  const dailyMeals = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === selectedDayNumber
    );
  }, [currentWeekPlan?.dailyMeals, selectedDayNumber]);

  const todaysMeals = useMemo(() => {
    const today = new Date();
    const todayDayNumber = today.getDay() === 6 ? 1 : today.getDay() + 2;
    
    if (!currentWeekPlan?.dailyMeals) return [];
    return currentWeekPlan.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === todayDayNumber
    );
  }, [currentWeekPlan?.dailyMeals]);

  const totalCalories = useMemo(() => {
    return dailyMeals.reduce((sum: number, meal: DailyMeal) => sum + (meal.calories || 0), 0);
  }, [dailyMeals]);

  const totalProtein = useMemo(() => {
    return dailyMeals.reduce((sum: number, meal: DailyMeal) => sum + (meal.protein || 0), 0);
  }, [dailyMeals]);

  const targetDayCalories = useMemo(() => {
    if (!currentWeekPlan?.weeklyPlan?.total_calories) return 2000;
    return Math.round(currentWeekPlan.weeklyPlan.total_calories / 7);
  }, [currentWeekPlan?.weeklyPlan?.total_calories]);

  const shoppingItems = useMemo(() => {
    if (!currentWeekPlan?.dailyMeals) return [];
    
    const ingredients: any[] = [];
    currentWeekPlan.dailyMeals.forEach((meal: DailyMeal) => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
          ingredients.push({
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            category: getCategoryForIngredient(ingredient.name)
          });
        });
      }
    });
    
    return ingredients;
  }, [currentWeekPlan?.dailyMeals]);

  return {
    dailyMeals,
    todaysMeals,
    totalCalories,
    totalProtein,
    targetDayCalories,
    shoppingItems
  };
};

const getCategoryForIngredient = (ingredientName: string): string => {
  const categories = {
    'Proteins': ['chicken', 'beef', 'pork', 'fish', 'eggs', 'tofu', 'beans', 'lentils'],
    'Vegetables': ['tomato', 'onion', 'garlic', 'carrot', 'spinach', 'broccoli', 'pepper'],
    'Grains': ['rice', 'bread', 'pasta', 'quinoa', 'oats', 'flour'],
    'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream'],
    'Fruits': ['apple', 'banana', 'orange', 'berry', 'lemon', 'lime'],
    'Spices': ['salt', 'pepper', 'cumin', 'paprika', 'oregano', 'basil'],
    'Others': []
  };

  const ingredient = ingredientName.toLowerCase();
  
  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => ingredient.includes(item))) {
      return category;
    }
  }
  
  return 'Others';
};
