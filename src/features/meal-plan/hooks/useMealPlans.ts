
import { useState } from 'react';

export const useMealPlans = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  return {
    mealPlans: [],
    isLoading,
    currentWeekPlan: null,
    generateMealPlan: async () => {},
    refreshMealPlan: async () => {}
  };
};
