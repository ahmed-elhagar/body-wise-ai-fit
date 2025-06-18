
import { useMemo } from 'react';

interface CalorieCalculationsParams {
  currentCalories?: number | null;
  targetCalories?: number | null;
}

export const useCalorieCalculations = (params?: CalorieCalculationsParams) => {
  return useMemo(() => {
    const current = params?.currentCalories || 0;
    const target = params?.targetCalories || 2000;
    
    const percentage = Math.min((current / target) * 100, 100);
    const remaining = Math.max(target - current, 0);
    
    return {
      current,
      target,
      percentage,
      remaining,
      isOverTarget: current > target
    };
  }, [params?.currentCalories, params?.targetCalories]);
};
