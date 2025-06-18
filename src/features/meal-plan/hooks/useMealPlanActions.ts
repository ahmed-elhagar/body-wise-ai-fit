
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { MealPlanFetchResult } from '../types';

export const useMealPlanActions = (
  currentWeekPlan: MealPlanFetchResult | null,
  currentWeekOffset: number,
  aiPreferences: any,
  refetch: () => Promise<any>
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handle = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      console.log('🤖 Generating AI meal plan with preferences:', aiPreferences);
      
      // Simulate API call for meal plan generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Meal plan generated successfully!');
      
      // Refetch data after generation
      await refetch();
      
    } catch (error) {
      console.error('❌ Error generating meal plan:', error);
      toast.error('Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [aiPreferences, refetch, isGenerating]);

  return {
    handle,
    isGenerating
  };
};
