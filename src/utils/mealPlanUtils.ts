
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
