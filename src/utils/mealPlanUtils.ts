
import { startOfWeek, addWeeks, format } from 'date-fns';

export const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
  return addWeeks(currentWeekStart, weekOffset);
};

export const getCurrentSaturdayDay = (): number => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Convert to Saturday-based week (Saturday = 1, Sunday = 2, etc.)
  return dayOfWeek === 6 ? 1 : dayOfWeek + 2;
};

export const formatWeekRange = (weekStartDate: Date): string => {
  const weekEndDate = addWeeks(weekStartDate, 1);
  return `${format(weekStartDate, 'MMM d')} - ${format(weekEndDate, 'MMM d, yyyy')}`;
};

export const getDayName = (dayNumber: number): string => {
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days[dayNumber - 1] || 'Unknown';
};

export const getDayNames = (t?: any): string[] => {
  if (t) {
    return [
      t('days.saturday'),
      t('days.sunday'), 
      t('days.monday'),
      t('days.tuesday'),
      t('days.wednesday'),
      t('days.thursday'),
      t('days.friday')
    ];
  }
  return ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
};

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
