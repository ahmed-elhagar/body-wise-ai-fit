
import { useState, useMemo } from 'react';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(getCurrentSaturdayDay());

  const weekStartDate = useMemo(() => {
    try {
      return getWeekStartDate(currentWeekOffset);
    } catch (error) {
      console.error('Error calculating week start date:', error);
      // Fallback to current week if there's an error
      return getWeekStartDate(0);
    }
  }, [currentWeekOffset]);

  const handleWeekOffsetChange = (newOffset: number) => {
    try {
      // Validate the new offset doesn't create invalid dates
      const testDate = getWeekStartDate(newOffset);
      if (testDate && !isNaN(testDate.getTime())) {
        setCurrentWeekOffset(newOffset);
      } else {
        console.error('Invalid week offset:', newOffset);
      }
    } catch (error) {
      console.error('Error changing week offset:', error);
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
    setSelectedDayNumber,
    weekStartDate
  };
};
