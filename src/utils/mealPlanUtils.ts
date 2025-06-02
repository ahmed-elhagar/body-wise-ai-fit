
import { addWeeks, startOfWeek } from 'date-fns';

export const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
  return addWeeks(currentWeekStart, weekOffset);
};

export const getCurrentSaturdayDay = (): number => {
  const today = new Date();
  // Convert to day number (Saturday = 1, Sunday = 2, ..., Friday = 7)
  return today.getDay() === 6 ? 1 : today.getDay() + 2;
};

export const getCategoryForIngredient = (ingredient: string): string => {
  // Simple categorization logic
  const ingredient_lower = ingredient.toLowerCase();
  
  if (ingredient_lower.includes('milk') || ingredient_lower.includes('cheese') || ingredient_lower.includes('yogurt')) {
    return 'Dairy';
  }
  if (ingredient_lower.includes('chicken') || ingredient_lower.includes('beef') || ingredient_lower.includes('fish')) {
    return 'Meat & Seafood';
  }
  if (ingredient_lower.includes('apple') || ingredient_lower.includes('banana') || ingredient_lower.includes('berry')) {
    return 'Fruits';
  }
  if (ingredient_lower.includes('carrot') || ingredient_lower.includes('lettuce') || ingredient_lower.includes('tomato')) {
    return 'Vegetables';
  }
  
  return 'Other';
};
