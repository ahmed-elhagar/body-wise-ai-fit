import { useState, useMemo } from 'react';
import { addDays, format, startOfWeek, isSameDay } from 'date-fns';
import { getCurrentWeekDates } from '../utils/mealPlanUtils';

interface UseMealPlanNavigationProps {
  initialDate?: Date;
}

export const useMealPlanNavigation = ({ initialDate }: UseMealPlanNavigationProps = {}) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());

  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
  const weekDates = useMemo(() => getCurrentWeekDates(), []);

  const formattedDate = useMemo(() => format(currentDate, 'yyyy-MM-dd'), [currentDate]);
  const formattedSelectedDate = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);

  const isDateInCurrentWeek = (date: Date) => {
    return weekDates.some(weekDate => isSameDay(date, weekDate));
  };

  const goToPreviousDay = () => {
    const prevDate = addDays(currentDate, -1);
    setCurrentDate(prevDate);
    if (!isDateInCurrentWeek(prevDate)) {
      setSelectedDate(prevDate);
    }
  };

  const goToNextDay = () => {
    const nextDate = addDays(currentDate, 1);
    setCurrentDate(nextDate);
    if (!isDateInCurrentWeek(nextDate)) {
      setSelectedDate(nextDate);
    }
  };

  const goToPreviousWeek = () => {
    const newDate = addDays(weekStart, -7);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = addDays(weekStart, 7);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return {
    currentDate,
    formattedDate,
    selectedDate,
    formattedSelectedDate,
    weekStart,
    weekDates,
    goToPreviousDay,
    goToNextDay,
    goToPreviousWeek,
    goToNextWeek,
    selectDate
  };
};
