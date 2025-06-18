
import { useState, useCallback, useMemo } from 'react';
import { getWeekStartDate, getCurrentSaturdayDay } from '@/utils/mealPlanUtils';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffsetInternal] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => getCurrentSaturdayDay());
  
  const weekStartDate = useMemo(() => getWeekStartDate(currentWeekOffset), [currentWeekOffset]);

  const setCurrentWeekOffset = useCallback(async (newOffset: number) => {
    console.log('📅 Changing week from', currentWeekOffset, 'to', newOffset);
    setCurrentWeekOffsetInternal(newOffset);
  }, [currentWeekOffset]);

  return {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate
  };
};
