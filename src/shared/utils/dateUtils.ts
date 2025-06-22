
import { format, parseISO, isValid } from 'date-fns';

export type DateFormat = 'short' | 'medium' | 'long' | 'full';

const formatMap = {
  short: 'MM/dd/yyyy',
  medium: 'MMM dd, yyyy',
  long: 'MMMM dd, yyyy',
  full: 'EEEE, MMMM dd, yyyy'
};

export const formatDate = (date: string | Date, formatType: DateFormat = 'medium'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return format(dateObj, formatMap[formatType]);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const isValidDate = (date: string | Date): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj);
  } catch {
    return false;
  }
};

export const getCurrentDate = (): string => {
  return new Date().toISOString();
};
