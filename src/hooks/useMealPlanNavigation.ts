
import { useState, useMemo } from 'react';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => {
    try {
      return getCurrentSaturdayDay();
    } catch (error) {
      console.error('Error getting current Saturday day:', error);
      return 1; // Default to day 1 if there's an error
    }
  });

  const weekStartDate = useMemo(() => {
    try {
      const date = getWeekStartDate(currentWeekOffset);
      if (!date || isNaN(date.getTime())) {
        console.error('Invalid date calculated for week offset:', currentWeekOffset);
        return getWeekStartDate(0); // Fallback to current week
      }
      return date;
    } catch (error) {
      console.error('Error calculating week start date:', error);
      return getWeekStartDate(0); // Fallback to current week
    }
  }, [currentWeekOffset]);

  const handleWeekOffsetChange = (newOffset: number) => {
    try {
      // Validate the new offset doesn't create invalid dates
      const testDate = getWeekStartDate(newOffset);
      if (testDate && !isNaN(testDate.getTime())) {
        console.log('🧭 Changing week offset from', currentWeekOffset, 'to', newOffset);
        setCurrentWeekOffset(newOffset);
      } else {
        console.error('Invalid week offset would create invalid date:', newOffset);
        throw new Error(`Invalid week offset: ${newOffset}`);
      }
    } catch (error) {
      console.error('Error changing week offset:', error);
      // Don't change the offset if there's an error
    }
  };

  const handleDayChange = (dayNumber: number) => {
    try {
      if (dayNumber >= 1 && dayNumber <= 7) {
        console.log('🧭 Changing selected day from', selectedDayNumber, 'to', dayNumber);
        setSelectedDayNumber(dayNumber);
      } else {
        console.error('Invalid day number:', dayNumber);
      }
    } catch (error) {
      console.error('Error changing selected day:', error);
    }
  };

  console.log('🧭 useMealPlanNavigation:', {
    currentWeekOffset,
    selectedDayNumber,
    weekStartDate: weekStartDate.toDateString()
  });

  return {
    currentWeekOffset,
    setCurrentWeekOffset: handleWeekOffsetChange,
    selectedDayNumber,
    setSelectedDayNumber: handleDayChange,
    weekStartDate
  };
};
