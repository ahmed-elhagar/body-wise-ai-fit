
export const getCategoryForIngredient = (ingredientName: string): string => {
  const ingredient = ingredientName.toLowerCase();
  
  // Proteins
  if (/chicken|beef|pork|fish|salmon|tuna|turkey|lamb|eggs|tofu|beans|lentils|chickpeas/.test(ingredient)) {
    return 'Proteins';
  }
  
  // Vegetables
  if (/tomato|onion|garlic|carrot|broccoli|spinach|lettuce|cucumber|pepper|celery|mushroom|potato|sweet potato/.test(ingredient)) {
    return 'Vegetables';
  }
  
  // Fruits
  if (/apple|banana|orange|berry|grape|lemon|lime|avocado|mango|pineapple/.test(ingredient)) {
    return 'Fruits';
  }
  
  // Grains & Carbs
  if (/rice|bread|pasta|flour|oats|quinoa|barley|wheat/.test(ingredient)) {
    return 'Grains & Carbs';
  }
  
  // Dairy
  if (/milk|cheese|yogurt|butter|cream/.test(ingredient)) {
    return 'Dairy';
  }
  
  // Condiments & Spices
  if (/salt|pepper|oil|vinegar|sauce|spice|herb|garlic|ginger/.test(ingredient)) {
    return 'Condiments & Spices';
  }
  
  return 'Other';
};

export const calculateCalories = (ingredients: any[]): number => {
  // Simple calorie calculation logic
  return ingredients.reduce((total, ingredient) => {
    const quantity = parseFloat(ingredient.quantity || '1');
    const baseCalories = 50; // Base calories per ingredient
    return total + (quantity * baseCalories);
  }, 0);
};

export const formatDateForMealPlan = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getCurrentWeekDates = (): Date[] => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

export const formatWeekRange = (weekStartDate: Date): string => {
  const endDate = new Date(weekStartDate);
  endDate.setDate(weekStartDate.getDate() + 6);
  
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric' 
  };
  
  const start = weekStartDate.toLocaleDateString('en-US', options);
  const end = endDate.toLocaleDateString('en-US', options);
  
  return `${start} - ${end}`;
};

export const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber - 1] || days[0];
};

export const getWeekStartDate = (weekOffset: number = 0): Date => {
  const today = new Date();
  const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const targetWeek = new Date(currentWeekStart);
  targetWeek.setDate(currentWeekStart.getDate() + (weekOffset * 7));
  return targetWeek;
};
