
import { startOfWeek, addWeeks, format } from 'date-fns';

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
