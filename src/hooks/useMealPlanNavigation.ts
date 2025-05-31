
import { useState, useMemo } from 'react';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(getCurrentSaturdayDay());

  const weekStartDate = useMemo(() => {
    return getWeekStartDate(currentWeekOffset);
  }, [currentWeekOffset]);

  console.log('🧭 useMealPlanNavigation:', {
    currentWeekOffset,
    selectedDayNumber,
    weekStartDate: weekStartDate.toDateString()
  });

  return {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate
  };
};
