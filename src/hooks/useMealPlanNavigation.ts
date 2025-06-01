
import { useState, useMemo } from 'react';
import { getWeekStartDate } from '@/utils/mealPlanUtils';
import { addDays } from 'date-fns';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 ? 7 : dayOfWeek;
  });

  const weekStartDate = useMemo(() => {
    return getWeekStartDate(currentWeekOffset);
  }, [currentWeekOffset]);

  const selectedDate = useMemo(() => {
    return addDays(weekStartDate, selectedDayNumber - 1);
  }, [weekStartDate, selectedDayNumber]);

  const navigateToWeek = (offset: number) => {
    setCurrentWeekOffset(offset);
  };

  const navigateToNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const navigateToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  const navigateToCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  return {
    currentWeekOffset,
    selectedDayNumber,
    weekStartDate,
    selectedDate,
    setCurrentWeekOffset,
    setSelectedDayNumber,
    navigateToWeek,
    navigateToNextWeek,
    navigateToPreviousWeek,
    navigateToCurrentWeek
  };
};
