
import { useMemo } from 'react';

interface CalorieCalculationsProps {
  currentDayCalories: number;
  targetDayCalories: number;
}

export const useCalorieCalculations = (
  currentDayCalories: number,
  targetDayCalories: number
) => {
  return useMemo(() => {
    const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);
    const progressPercentage = Math.min(100, (currentDayCalories / targetDayCalories) * 100);
    
    return {
      remainingCalories,
      progressPercentage
    };
  }, [currentDayCalories, targetDayCalories]);
};
