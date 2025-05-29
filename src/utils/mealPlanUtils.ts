
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';

export const getCategoryForIngredient = (ingredientName: string): string => {
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

export const getWeekStartDate = (offset: number = 0): Date => {
  const today = new Date();
  const saturday = startOfWeek(today, { weekStartsOn: 6 }); // 6 = Saturday
  return addWeeks(saturday, offset);
};

export const getMealPlanWeekDates = (weekStartDate: Date) => {
  return {
    weekStartDateStr: format(weekStartDate, 'yyyy-MM-dd'),
    weekEndDate: addDays(weekStartDate, 6),
  };
};

export const getSaturdayOfWeek = (date: Date, offset: number = 0): Date => {
  return getWeekStartDate(offset);
};

export const getCurrentSaturdayDay = (): number => {
  const today = new Date();
  const saturday = getWeekStartDate(0);
  const daysDiff = Math.floor((today.getTime() - saturday.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(7, daysDiff + 1));
};
