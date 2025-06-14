
import { format, addDays, startOfWeek } from 'date-fns';

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
  // Simple categorization logic
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
