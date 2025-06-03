
import { startOfWeek, addWeeks, format, addDays } from 'date-fns';

// Consistent week start calculation - Saturday as week start (day 6)
export const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
  const targetWeek = addWeeks(currentWeekStart, weekOffset);
  return targetWeek;
};

export const formatWeekStartDate = (weekOffset: number = 0): string => {
  const weekStartDate = getWeekStartDate(weekOffset);
  return format(weekStartDate, 'yyyy-MM-dd');
};

export const getCurrentWeekOffset = (): number => {
  // Calculate current week offset from a reference point
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 });
  
  // Use a consistent reference date (e.g., 2025-01-01)
  const referenceDate = new Date('2025-01-01');
  const referenceWeekStart = startOfWeek(referenceDate, { weekStartsOn: 6 });
  
  const diffTime = currentWeekStart.getTime() - referenceWeekStart.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return diffWeeks;
};

// Get current day number (Saturday = 1, Sunday = 2, ..., Friday = 7)
export const getCurrentSaturdayDay = (): number => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  return dayOfWeek === 6 ? 1 : dayOfWeek + 2;
};

// Format week range for display
export const formatWeekRange = (weekStartDate: Date): string => {
  const weekEndDate = addDays(weekStartDate, 6);
  const startMonth = format(weekStartDate, 'MMM');
  const startDay = format(weekStartDate, 'd');
  const endMonth = format(weekEndDate, 'MMM');
  const endDay = format(weekEndDate, 'd');
  const year = format(weekStartDate, 'yyyy');

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
};

// Get day name by day number
export const getDayName = (dayNumber: number): string => {
  const dayNames = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return dayNames[dayNumber] || 'Day';
};

// Get category for ingredient (for shopping list)
export const getCategoryForIngredient = (ingredient: string): string => {
  const categories = {
    'Meat & Poultry': ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp'],
    'Dairy & Eggs': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'eggs'],
    'Fruits': ['apple', 'banana', 'orange', 'berries', 'grapes', 'lemon', 'lime'],
    'Vegetables': ['onion', 'garlic', 'tomato', 'carrot', 'broccoli', 'spinach', 'lettuce'],
    'Grains & Bread': ['rice', 'bread', 'pasta', 'flour', 'oats', 'quinoa'],
    'Pantry': ['oil', 'salt', 'pepper', 'sugar', 'spices', 'sauce', 'vinegar']
  };

  const lowerIngredient = ingredient.toLowerCase();
  
  for (const [category, items] of Object.entries(categories)) {
    if (items.some(item => lowerIngredient.includes(item))) {
      return category;
    }
  }
  
  return 'Other';
};
