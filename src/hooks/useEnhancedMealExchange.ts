
import { useState } from 'react';
import { useMealExchange } from '@/features/meal-plan/hooks';
import type { DailyMeal } from '@/features/meal-plan/types';

// Legacy compatibility wrapper for useEnhancedMealExchange
export const useEnhancedMealExchange = () => {
  const {
    isLoading: isExchanging,
    alternatives,
    generateAlternatives,
    exchangeMeal,
    quickExchange,
  } = useMealExchange();

  // Convert DailyMeal to the legacy Meal format for compatibility
  const generateMealAlternatives = async (meal: any) => {
    const dailyMeal: DailyMeal = {
      id: meal.id,
      weekly_plan_id: meal.weekly_plan_id || '',
      day_number: meal.day_number || 1,
      meal_type: meal.meal_type || meal.type,
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      prep_time: meal.prepTime || meal.prep_time,
      cook_time: meal.cookTime || meal.cook_time,
      servings: meal.servings,
      ingredients: meal.ingredients || [],
      instructions: meal.instructions || [],
      alternatives: [],
      youtube_search_term: meal.youtube_search_term,
      image_url: meal.image_url || meal.imageUrl,
      recipe_fetched: false
    };

    return await generateAlternatives(dailyMeal, 'user_preference');
  };

  const legacyExchangeMeal = async (meal: any, alternative: any) => {
    const success = await exchangeMeal(alternative);
    return success;
  };

  return {
    isExchanging,
    alternatives,
    generateMealAlternatives,
    exchangeMeal: legacyExchangeMeal,
  };
};
