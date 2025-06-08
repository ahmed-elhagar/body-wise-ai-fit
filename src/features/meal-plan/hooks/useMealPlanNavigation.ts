
import { useState } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(() => {
    const today = new Date();
    // Convert to day number (Saturday = 1, Sunday = 2, ..., Friday = 7)
    return today.getDay() === 6 ? 1 : today.getDay() + 2;
  });
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  const currentDate = new Date();
  const weekStartDate = addDays(startOfWeek(currentDate), currentWeekOffset * 7);
  const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');

  return {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    viewMode,
    setViewMode,
    weekStartDate,
    weekStartDateString,
  };
};
