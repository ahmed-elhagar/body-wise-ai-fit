
import { useState, useMemo } from 'react';
import { addWeeks, startOfWeek } from 'date-fns';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => {
    const today = new Date();
    // Convert to day number (Saturday = 1, Sunday = 2, ..., Friday = 7)
    return today.getDay() === 6 ? 1 : today.getDay() + 2;
  });

  const weekStartDate = useMemo(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
    return addWeeks(currentWeekStart, currentWeekOffset);
  }, [currentWeekOffset]);

  console.log('🗓️ NAVIGATION STATE:', {
    currentWeekOffset,
    selectedDayNumber,
    weekStartDate: weekStartDate.toDateString(),
    today: new Date().toDateString()
  });

  return {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate
  };
};
