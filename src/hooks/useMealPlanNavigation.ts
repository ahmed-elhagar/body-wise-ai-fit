
import { useState } from "react";
import { getCurrentSaturdayDay, getWeekStartDate } from "@/utils/mealPlanUtils";

export const useMealPlanNavigation = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayNumber, setSelectedDayNumber] = useState(getCurrentSaturdayDay());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  const weekStartDate = getWeekStartDate(currentWeekOffset);

  return {
    currentWeekOffset,
    setCurrentWeekOffset,
    selectedDayNumber,
    setSelectedDayNumber,
    viewMode,
    setViewMode,
    weekStartDate
  };
};
