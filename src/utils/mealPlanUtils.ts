
import { addWeeks, startOfWeek, format } from 'date-fns';
import type { DailyMeal } from '@/features/meal-plan/types';

export const getWeekStartDate = (offset: number = 0): Date => {
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
  return addWeeks(currentWeekStart, offset);
};

export const formatWeekStartDate = (offset: number = 0): string => {
  return format(getWeekStartDate(offset), 'yyyy-MM-dd');
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
