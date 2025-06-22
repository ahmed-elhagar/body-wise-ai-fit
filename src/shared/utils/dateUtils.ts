// Shared Date Utilities
// Common date/time functions used across all features

import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, addDays, isToday, isYesterday, isTomorrow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export type DateFormat = 'short' | 'medium' | 'long' | 'iso' | 'time' | 'datetime';
export type Locale = 'en' | 'ar';

// Date formatting utilities
export const dateUtils = {
  // Format date with locale support
  formatDate(date: Date | string, format: DateFormat = 'medium', locale: Locale = 'en'): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const localeObj = locale === 'ar' ? ar : enUS;

    const formats = {
      short: 'MM/dd/yyyy',
      medium: 'MMM d, yyyy', 
      long: 'MMMM d, yyyy',
      iso: 'yyyy-MM-dd',
      time: 'HH:mm',
      datetime: 'MMM d, yyyy HH:mm'
    };

    try {
      return format(dateObj, formats[format], { locale: localeObj });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateObj.toLocaleDateString();
    }
  },

  // Get relative date strings
  getRelativeDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isToday(dateObj)) return 'Today';
    if (isYesterday(dateObj)) return 'Yesterday';
    if (isTomorrow(dateObj)) return 'Tomorrow';
    
    return this.formatDate(dateObj, 'short');
  },

  // Date range utilities
  getDateRange(startDate: Date | string, endDate: Date | string) {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    return {
      start: startOfDay(start),
      end: endOfDay(end),
      duration: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    };
  },

  // Week utilities
  getCurrentWeek() {
    const now = new Date();
    return {
      start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
      end: endOfWeek(now, { weekStartsOn: 1 }),
      days: this.getWeekDays(now)
    };
  },

  getWeekDays(date: Date = new Date()) {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  },

  // Timezone utilities
  toUserTimezone(date: Date | string, timezone?: string): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (timezone) {
      return new Date(dateObj.toLocaleString('en-US', { timeZone: timezone }));
    }
    
    return dateObj;
  },

  // Database date utilities
  toISOString(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  },

  fromISOString(isoString: string): Date {
    return new Date(isoString);
  },

  // Validation utilities
  isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  },

  // Age calculation
  calculateAge(birthDate: Date | string): number {
    const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  // Meal time utilities
  getMealTimeCategory(date: Date = new Date()): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
    const hour = date.getHours();
    
    if (hour >= 5 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 22) return 'dinner';
    return 'snack';
  },

  // Streak calculation
  calculateStreak(dates: (Date | string)[]): number {
    if (dates.length === 0) return 0;
    
    const sortedDates = dates
      .map(d => typeof d === 'string' ? new Date(d) : d)
      .map(d => this.formatDate(d, 'iso'))
      .sort()
      .reverse();
    
    let streak = 1;
    let currentDate = new Date(sortedDates[0]);
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i]);
      const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
}; 