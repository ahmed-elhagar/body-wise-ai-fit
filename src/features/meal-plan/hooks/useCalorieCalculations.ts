
import { useMemo } from 'react';

export const useCalorieCalculations = (currentDayCalories: number, targetDayCalories: number) => {
  const remainingCalories = useMemo(() => {
    return Math.max(0, targetDayCalories - currentDayCalories);
  }, [currentDayCalories, targetDayCalories]);

  const progressPercentage = useMemo(() => {
    if (targetDayCalories === 0) return 0;
    return Math.min(100, (currentDayCalories / targetDayCalories) * 100);
  }, [currentDayCalories, targetDayCalories]);

  const isOverTarget = currentDayCalories > targetDayCalories;

  return {
    remainingCalories,
    progressPercentage,
    isOverTarget
  };
};
