
import { useMemo } from 'react';
import { calculateDailyNutrition } from '../utils';

export const useMealPlanCalculations = (meals: any[] = []) => {
  const dailyNutrition = useMemo(() => {
    return calculateDailyNutrition(meals);
  }, [meals]);

  const nutritionPercentages = useMemo(() => {
    const { calories, protein, carbs, fats } = dailyNutrition;
    const total = protein + carbs + fats;
    
    return {
      protein: total > 0 ? Math.round((protein / total) * 100) : 0,
      carbs: total > 0 ? Math.round((carbs / total) * 100) : 0,
      fats: total > 0 ? Math.round((fats / total) * 100) : 0,
    };
  }, [dailyNutrition]);

  return {
    dailyNutrition,
    nutritionPercentages,
  };
};
