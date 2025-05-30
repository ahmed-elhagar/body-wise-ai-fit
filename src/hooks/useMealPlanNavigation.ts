
import { useState, useMemo } from "react";
import { startOfWeek, addWeeks } from "date-fns";

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(1); // Saturday = 1

  // Calculate week start date based on offset (Saturday as week start)
  const weekStartDate = useMemo(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 6 }); // Saturday = 6
    return addWeeks(currentWeekStart, currentWeekOffset);
  }, [currentWeekOffset]);

  console.log('🗓️ Navigation: Week offset:', currentWeekOffset, 'Week start:', weekStartDate.toDateString());

  return {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    weekStartDate
  };
};
