
import { useState } from 'react';
import { toast } from 'sonner';
import type { MealPlanPreferences } from '../types';

export const useMealGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMealPlan = async (preferences: MealPlanPreferences) => {
    setIsGenerating(true);
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Meal plan generated successfully!');
      return true;
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast.error('Failed to generate meal plan');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan,
    isGenerating
  };
};
