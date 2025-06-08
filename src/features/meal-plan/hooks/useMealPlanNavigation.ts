
import { useState } from 'react';
import { addDays, startOfWeek, format } from 'date-fns';

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  const currentDate = new Date();
  const weekStartDate = addDays(startOfWeek(currentDate), currentWeekOffset * 7);
  const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');

  return {
    currentWeekOffset,
    setCurrentWeekOffset,
    viewMode,
    setViewMode,
    weekStartDate,
    weekStartDateString,
  };
};
