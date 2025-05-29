
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

// CRITICAL FIX: Completely rewritten week calculation for absolute consistency
export const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  console.log('🔍 Week calculation input:', {
    today: today.toISOString().split('T')[0],
    todayDay: today.getDay(),
    weekOffset
  });
  
  // Use date-fns startOfWeek with Saturday as start (weekStartsOn: 6)
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 6 });
  const targetWeek = addWeeks(startOfCurrentWeek, weekOffset);
  
  // Ensure we get a clean date
  const result = new Date(targetWeek);
  result.setHours(0, 0, 0, 0);
  
  console.log('🎯 Week calculation result:', {
    input: { today: today.toISOString().split('T')[0], weekOffset },
    output: result.toISOString().split('T')[0],
    startOfCurrentWeek: startOfCurrentWeek.toISOString().split('T')[0]
  });
  
  return result;
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
  
  // Convert to Saturday-based numbering (Saturday = 1, Sunday = 2, etc.)
  const saturdayBasedDay = currentDayOfWeek === 6 ? 1 : currentDayOfWeek + 2;
  
  console.log('📅 Current day calculation:', {
    today: today.toLocaleDateString(),
    dayOfWeek: currentDayOfWeek,
    saturdayBasedDay
  });
  
  return saturdayBasedDay;
};
