
import { useState, useMemo } from 'react';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => getCurrentSaturdayDay());

  const weekStartDate = useMemo(() => getWeekStartDate(currentWeekOffset), [currentWeekOffset]);

  const handleWeekOffsetChange = (newOffset: number) => {
    console.log('🧭 Changing week offset from', currentWeekOffset, 'to', newOffset);
    setCurrentWeekOffset(newOffset);
  };

  const handleDayChange = (dayNumber: number) => {
    if (dayNumber >= 1 && dayNumber <= 7) {
      console.log('🧭 Changing selected day from', selectedDayNumber, 'to', dayNumber);
      setSelectedDayNumber(dayNumber);
    }
  };

  return {
    currentWeekOffset,
    setCurrentWeekOffset: handleWeekOffsetChange,
    selectedDayNumber,
    setSelectedDayNumber: handleDayChange,
    weekStartDate
  };
};
