
import { addWeeks, startOfWeek, format } from 'date-fns';
import type { DailyMeal } from '@/features/meal-plan/types';

// Cache to prevent excessive recalculation
const weekStartCache = new Map<number, Date>();

export const getWeekStartDate = (offset: number = 0): Date => {
  // Check cache first
  if (weekStartCache.has(offset)) {
    return weekStartCache.get(offset)!;
  }

  const today = new Date();
  
  // EXACT MATCH with backend: Use Saturday as week start to match backend calculation
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const currentSaturday = new Date(today);
  currentSaturday.setDate(today.getDate() - dayOfWeek + 6); // Go to this week's Saturday
  
  // Apply the week offset exactly like backend
  const targetWeek = new Date(currentSaturday);
  targetWeek.setDate(currentSaturday.getDate() + offset * 7);
  
  // Cache the result
  weekStartCache.set(offset, targetWeek);
  
  // Clear cache periodically to prevent memory leaks
  if (weekStartCache.size > 10) {
    const oldestKey = Math.min(...weekStartCache.keys());
    weekStartCache.delete(oldestKey);
  }
  
  console.log('📅 getWeekStartDate calculation (cached):', {
    offset,
    targetWeek: targetWeek.toISOString().split('T')[0],
    cacheSize: weekStartCache.size
  });
  
  return targetWeek;
};

export const formatWeekStartDate = (offset: number = 0): string => {
  return format(getWeekStartDate(offset), 'yyyy-MM-dd');
};

export const formatWeekRange = (startDate: Date): string => {
  const endDate = addWeeks(startDate, 1);
  const startMonth = format(startDate, 'MMM');
  const startDay = format(startDate, 'd');
  const endMonth = format(endDate, 'MMM');
  const endDay = format(endDate, 'd');
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
};

export const getCurrentSaturdayDay = (): number => {
  const today = new Date();
  // Convert to day number (Saturday = 1, Sunday = 2, ..., Friday = 7)
  return today.getDay() === 6 ? 1 : today.getDay() + 2;
};

export const getCategoryForIngredient = (ingredientName: string): string => {
  const ingredient = ingredientName.toLowerCase();
  
  // Produce
  if (ingredient.includes('lettuce') || ingredient.includes('tomato') || ingredient.includes('onion') || 
      ingredient.includes('garlic') || ingredient.includes('pepper') || ingredient.includes('carrot') ||
      ingredient.includes('celery') || ingredient.includes('spinach') || ingredient.includes('cucumber') ||
      ingredient.includes('avocado') || ingredient.includes('broccoli') || ingredient.includes('mushroom') ||
      ingredient.includes('potato') || ingredient.includes('apple') || ingredient.includes('banana') ||
      ingredient.includes('lemon') || ingredient.includes('lime') || ingredient.includes('orange')) {
    return 'Produce';
  }
  
  // Meat & Seafood
  if (ingredient.includes('chicken') || ingredient.includes('beef') || ingredient.includes('pork') ||
      ingredient.includes('fish') || ingredient.includes('salmon') || ingredient.includes('shrimp') ||
      ingredient.includes('turkey') || ingredient.includes('lamb') || ingredient.includes('tuna')) {
    return 'Meat & Seafood';
  }
  
  // Dairy
  if (ingredient.includes('milk') || ingredient.includes('cheese') || ingredient.includes('butter') ||
      ingredient.includes('yogurt') || ingredient.includes('cream') || ingredient.includes('egg')) {
    return 'Dairy';
  }
  
  // Grains & Cereals
  if (ingredient.includes('rice') || ingredient.includes('pasta') || ingredient.includes('bread') ||
      ingredient.includes('flour') || ingredient.includes('oats') || ingredient.includes('quinoa') ||
      ingredient.includes('wheat') || ingredient.includes('barley')) {
    return 'Grains & Cereals';
  }
  
  // Spices & Herbs
  if (ingredient.includes('salt') || ingredient.includes('pepper') || ingredient.includes('oregano') ||
      ingredient.includes('basil') || ingredient.includes('thyme') || ingredient.includes('rosemary') ||
      ingredient.includes('cumin') || ingredient.includes('paprika') || ingredient.includes('cinnamon') ||
      ingredient.includes('ginger') || ingredient.includes('turmeric')) {
    return 'Spices & Herbs';
  }
  
  // Pantry
  if (ingredient.includes('oil') || ingredient.includes('vinegar') || ingredient.includes('sauce') ||
      ingredient.includes('stock') || ingredient.includes('broth') || ingredient.includes('sugar') ||
      ingredient.includes('honey') || ingredient.includes('beans') || ingredient.includes('nuts') ||
      ingredient.includes('seeds')) {
    return 'Pantry';
  }
  
  return 'Other';
};

export const processMealData = (meal: any): DailyMeal => {
  // Safely parse JSON fields
  const parseJsonField = (field: any, fallback: any = []) => {
    if (!field) return fallback;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return fallback;
      }
    }
    return Array.isArray(field) ? field : fallback;
  };

  return {
    ...meal,
    ingredients: parseJsonField(meal.ingredients, []),
    instructions: parseJsonField(meal.instructions, []),
    alternatives: parseJsonField(meal.alternatives, [])
  };
};

export const getDayName = (dayNumber: number, language: string = 'en'): string => {
  const dayNames = {
    en: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    ar: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
  };
  
  const names = dayNames[language as keyof typeof dayNames] || dayNames.en;
  return names[dayNumber - 1] || names[0];
};
