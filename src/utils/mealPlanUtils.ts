
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';

export const getDayNames = (t: (key: string) => string) => {
  return [
    t('day.saturday'),
    t('day.sunday'),
    t('day.monday'),
    t('day.tuesday'),
    t('day.wednesday'),
    t('day.thursday'),
    t('day.friday')
  ];
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

// CRITICAL: Standardized week calculation - SAME logic for both generation and fetching
export const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  
  // Get the current day of week (0 = Sunday, 6 = Saturday)
  const currentDayOfWeek = today.getDay();
  
  // Calculate days to go back to Saturday (6)
  // If today is Saturday (6), go back 0 days
  // If today is Sunday (0), go back 1 day
  // If today is Monday (1), go back 2 days, etc.
  const daysToSaturday = currentDayOfWeek === 6 ? 0 : (currentDayOfWeek + 1);
  
  // Start from Saturday of current week
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - daysToSaturday);
  
  // Add the week offset
  startDate.setDate(startDate.getDate() + (weekOffset * 7));
  
  // Reset to start of day to ensure consistency
  startDate.setHours(0, 0, 0, 0);
  
  console.log(`📅 STANDARDIZED Week calculation: today=${today.toISOString().split('T')[0]}, currentDay=${currentDayOfWeek}, daysToSaturday=${daysToSaturday}, weekOffset=${weekOffset}, result=${startDate.toISOString().split('T')[0]}`);
  
  return startDate;
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
  const currentDayOfWeek = today.getDay();
  
  // Convert Sunday=0 to Saturday=1 system
  // Saturday = 6 -> 1, Sunday = 0 -> 2, Monday = 1 -> 3, etc.
  const saturdayBasedDay = currentDayOfWeek === 6 ? 1 : currentDayOfWeek + 2;
  
  console.log(`📅 Current day calculation: today=${today.toLocaleDateString()}, dayOfWeek=${currentDayOfWeek}, saturdayBasedDay=${saturdayBasedDay}`);
  
  return saturdayBasedDay;
};
