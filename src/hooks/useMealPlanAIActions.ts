
import { useCallback } from 'react';
import { useEnhancedMealPlan } from './useEnhancedMealPlan';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useMealPlanAIActions = (coreState: any, dialogsState: any) => {
  const { generateMealPlan, isGenerating } = useEnhancedMealPlan();
  const { language } = useLanguage();

  const handleGenerateAIPlan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🤖 Starting AI meal plan generation with preferences:', {
        preferences: dialogsState.aiPreferences,
        weekOffset: coreState.currentWeekOffset,
        language
      });

      const success = await generateMealPlan(dialogsState.aiPreferences, {
        weekOffset: coreState.currentWeekOffset
      });

      if (success) {
        // Close the AI dialog
        dialogsState.closeAIDialog();
        
        // Refetch the meal plan data
        await coreState.refetch();
        
        toast.success(
          language === 'ar'
            ? 'تم إنشاء خطة الوجبات بنجاح!'
            : 'Meal plan generated successfully!'
        );
      }

      return success;
    } catch (error: any) {
      console.error('❌ Error in handleGenerateAIPlan:', error);
      toast.error(
        language === 'ar'
          ? 'فشل في إنشاء خطة الوجبات'
          : 'Failed to generate meal plan'
      );
      return false;
    }
  }, [generateMealPlan, dialogsState, coreState, language]);

  return {
    handleGenerateAIPlan,
    isGenerating
  };
};
