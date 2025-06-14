
import { format, addDays, startOfWeek } from 'date-fns';
import type { DailyMeal, MealIngredient } from '../types';

export const formatWeekRange = (weekStartDate: Date): string => {
  const weekEndDate = addDays(weekStartDate, 6);
  return `${format(weekStartDate, 'MMM d')} - ${format(weekEndDate, 'MMM d, yyyy')}`;
};

export const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber - 1] || 'Day';
};

export const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
};

export const formatDateForMealPlan = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getCategoryForIngredient = (ingredient: string): string => {
  const categories = {
    'meat': ['chicken', 'beef', 'pork', 'fish', 'turkey'],
    'vegetables': ['tomato', 'onion', 'carrot', 'pepper', 'lettuce'],
    'dairy': ['milk', 'cheese', 'yogurt', 'butter'],
    'grains': ['rice', 'bread', 'pasta', 'oats']
  };
  
  const lowerIngredient = ingredient.toLowerCase();
  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => lowerIngredient.includes(item))) {
      return category;
    }
  }
  
  return 'other';
};

// Helper function to safely parse JSON data
export const safeJsonParse = (data: any, fallback: any = []): any => {
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }
  return data || fallback;
};

// Helper function to convert database meal to our DailyMeal type
export const convertDatabaseMeal = (dbMeal: any): DailyMeal => {
  return {
    id: dbMeal.id,
    weekly_plan_id: dbMeal.weekly_plan_id,
    day_number: dbMeal.day_number,
    meal_type: dbMeal.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'snack1' | 'snack2',
    name: dbMeal.name,
    calories: dbMeal.calories,
    protein: dbMeal.protein,
    carbs: dbMeal.carbs,
    fat: dbMeal.fat,
    ingredients: safeJsonParse(dbMeal.ingredients, []) as MealIngredient[],
    instructions: safeJsonParse(dbMeal.instructions, []) as string[],
    prep_time: dbMeal.prep_time,
    cook_time: dbMeal.cook_time,
    servings: dbMeal.servings,
    alternatives: safeJsonParse(dbMeal.alternatives, []) as string[],
    image_url: dbMeal.image_url,
    youtube_search_term: dbMeal.youtube_search_term,
    recipe_fetched: dbMeal.recipe_fetched,
    created_at: dbMeal.created_at
  };
};
