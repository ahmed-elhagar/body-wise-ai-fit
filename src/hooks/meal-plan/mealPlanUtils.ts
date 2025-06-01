
import type { DailyMeal } from './types';

// Enhanced JSON parsing with better error handling
export const safeParseJson = (jsonField: any, fallback: any = []) => {
  if (Array.isArray(jsonField)) return jsonField;
  if (!jsonField) return fallback;
  
  if (typeof jsonField === 'string') {
    try {
      const parsed = JSON.parse(jsonField);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      console.warn('Failed to parse JSON field:', jsonField, error);
      return fallback;
    }
  }
  
  if (typeof jsonField === 'object') {
    return jsonField;
  }
  
  return fallback;
};

// Process meal data with safe JSON parsing
export const processMealData = (meal: any): DailyMeal => {
  try {
    return {
      id: meal.id,
      weekly_plan_id: meal.weekly_plan_id,
      day_number: meal.day_number,
      meal_type: meal.meal_type,
      name: meal.name,
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      prep_time: meal.prep_time || 0,
      cook_time: meal.cook_time || 0,
      servings: meal.servings || 1,
      youtube_search_term: meal.youtube_search_term,
      image_url: meal.image_url,
      recipe_fetched: meal.recipe_fetched || false,
      ingredients: safeParseJson(meal.ingredients, []),
      instructions: safeParseJson(meal.instructions, []),
      alternatives: safeParseJson(meal.alternatives, [])
    };
  } catch (parseError) {
    console.error('Error parsing meal data:', parseError, meal);
    // Return meal with safe defaults
    return {
      id: meal.id,
      weekly_plan_id: meal.weekly_plan_id,
      day_number: meal.day_number,
      meal_type: meal.meal_type,
      name: meal.name,
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      prep_time: meal.prep_time || 0,
      cook_time: meal.cook_time || 0,
      servings: meal.servings || 1,
      youtube_search_term: meal.youtube_search_term,
      image_url: meal.image_url,
      recipe_fetched: meal.recipe_fetched || false,
      ingredients: [],
      instructions: [],
      alternatives: []
    };
  }
};
