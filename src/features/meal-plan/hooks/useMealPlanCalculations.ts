
import { useMemo } from 'react';
import type { DailyMeal, MealPlanFetchResult } from '../types';
import { MealPlanService } from '../services/mealPlanService';

export const useMealPlanCalculations = (mealPlanData: MealPlanFetchResult | null, selectedDayNumber: number) => {
  const dailyMeals = useMemo(() => {
    if (!mealPlanData?.dailyMeals) return [];
    return mealPlanData.dailyMeals.filter(
      (meal: DailyMeal) => meal.day_number === selectedDayNumber
    );
  }, [mealPlanData?.dailyMeals, selectedDayNumber]);

  const todaysMeals = useMemo(() => {
    const todayDayNumber = MealPlanService.getCurrentSaturdayDay();
    
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

  const shoppingItems = useMemo(() => {
    if (!mealPlanData?.dailyMeals) return [];
    
    const ingredients: any[] = [];
    mealPlanData.dailyMeals.forEach((meal: DailyMeal) => {
      if (meal.ingredients && Array.isArray(meal.ingredients)) {
        meal.ingredients.forEach((ingredient: any) => {
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

const getCategoryForIngredient = (ingredientName: string): string => {
  if (!ingredientName || typeof ingredientName !== 'string') {
    return 'Others';
  }

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
