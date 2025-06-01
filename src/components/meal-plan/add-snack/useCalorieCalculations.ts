
import { useMemo } from "react";

interface UseCalorieCalculationsProps {
  currentDayCalories: number;
  targetDayCalories: number;
}

export const useCalorieCalculations = (
  currentDayCalories: number,
  targetDayCalories: number
) => {
  const calculations = useMemo(() => {
    const dynamicTargetCalories = Math.max(targetDayCalories, 1200);
    const remainingCalories = Math.max(0, dynamicTargetCalories - currentDayCalories);
    const progressPercentage = Math.min(
      100,
      Math.max(0, (currentDayCalories / dynamicTargetCalories) * 100)
    );

    return {
      dynamicTargetCalories,
      remainingCalories,
      progressPercentage
    };
  }, [currentDayCalories, targetDayCalories]);

  return calculations;
};
