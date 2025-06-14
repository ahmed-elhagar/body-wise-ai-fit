
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';

export const formatWeekRange = (weekStartDate: Date): string => {
  const weekEndDate = addDays(weekStartDate, 6);
  
  if (weekStartDate.getMonth() === weekEndDate.getMonth()) {
    return `${format(weekStartDate, 'MMM d')} - ${format(weekEndDate, 'd, yyyy')}`;
  } else {
    return `${format(weekStartDate, 'MMM d')} - ${format(weekEndDate, 'MMM d, yyyy')}`;
  }
};

export const getDayName = (dayNumber: number): string => {
  const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return dayNames[dayNumber - 1] || 'Day ' + dayNumber;
};

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

export const formatMealTime = (mealType: string): string => {
  const mealTimes = {
    breakfast: '8:00 AM',
    lunch: '12:00 PM',
    dinner: '6:00 PM',
    snack: 'Anytime'
  };
  return mealTimes[mealType.toLowerCase()] || 'Anytime';
};

export const calculateDayProgress = (consumed: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((consumed / target) * 100), 100);
};
