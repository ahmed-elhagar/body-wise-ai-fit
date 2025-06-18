
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useEnhancedMealPlan } from '@/hooks/useEnhancedMealPlan';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MealPlanFetchResult } from '../types';

export const useMealPlanActions = (
  currentWeekPlan: MealPlanFetchResult | null,
  currentWeekOffset: number,
  aiPreferences: any,
  refetch: () => Promise<any>
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateMealPlan } = useEnhancedMealPlan();
  const { t = (key: string) => key } = useLanguage() || {};

  const handle = useCallback(async () => {
    if (isGenerating) return false;

    console.log('🤖 Starting meal plan generation with preferences:', aiPreferences);
    
    try {
      setIsGenerating(true);
      
      const success = await generateMealPlan(aiPreferences, { weekOffset: currentWeekOffset });
      
      if (success) {
        console.log('✅ Meal plan generation successful');
        toast.success(t('mealPlan.planGeneratedSuccess') || 'Meal plan generated successfully!');
        
        // Wait a moment then refetch data
        setTimeout(async () => {
          await refetch();
        }, 1000);
        
        return true;
      } else {
        console.error('❌ Meal plan generation failed');
        toast.error(t('mealPlan.planGenerationFailed') || 'Failed to generate meal plan');
        return false;
      }
    } catch (error) {
      console.error('❌ Error in meal plan generation:', error);
      toast.error(t('mealPlan.planGenerationFailed') || 'Failed to generate meal plan');
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, [aiPreferences, refetch, isGenerating, generateMealPlan, currentWeekOffset, t]);

  return {
    handle,
    isGenerating
  };
};
