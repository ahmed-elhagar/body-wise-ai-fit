
import { useState } from 'react';
import { toast } from 'sonner';
import { useEnhancedMealPlan } from '@/hooks/useEnhancedMealPlan';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MealPlanPreferences } from '../types';

export const useMealGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateMealPlan } = useEnhancedMealPlan();
  const { t = (key: string) => key } = useLanguage() || {};

  const generateMealPlanAction = async (preferences: MealPlanPreferences) => {
    if (isGenerating) return false;
    
    setIsGenerating(true);
    try {
      console.log('🍽️ Generating meal plan with preferences:', preferences);
      
      const success = await generateMealPlan(preferences);
      
      if (success) {
        toast.success(t('mealPlan.planGeneratedSuccess') || 'Meal plan generated successfully!');
        return true;
      } else {
        toast.error(t('mealPlan.planGenerationFailed') || 'Failed to generate meal plan');
        return false;
      }
    } catch (error) {
      console.error('❌ Error generating meal plan:', error);
      toast.error(t('errors.aiGenerationFailed') || 'AI generation failed');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateMealPlan: generateMealPlanAction,
    isGenerating
  };
};
