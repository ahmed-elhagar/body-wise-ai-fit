
import { useCallback } from 'react';
import { useEnhancedMealPlan } from './useEnhancedMealPlan';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCentralizedCredits } from '@/hooks/useCentralizedCredits';
import { toast } from 'sonner';

export const useMealPlanAIActions = (coreState: any, dialogsState: any) => {
  const { generateMealPlan, isGenerating } = useEnhancedMealPlan();
  const { remaining: userCredits, isPro, hasCredits } = useCentralizedCredits();
  const { language } = useLanguage();

  const handleGenerateAIPlan = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🤖 Starting AI meal plan generation with centralized credits:', {
        preferences: dialogsState.aiPreferences,
        weekOffset: coreState.currentWeekOffset,
        language,
        hasCredits,
        userCredits,
        isPro
      });

      if (!hasCredits) {
        const errorMessage = language === 'ar'
          ? 'لا توجد رصيد كافٍ لتوليد الخطة'
          : 'No AI credits remaining. Please upgrade your plan.';
        
        toast.error(errorMessage);
        return false;
      }

      const success = await generateMealPlan(dialogsState.aiPreferences, {
        weekOffset: coreState.currentWeekOffset
      });

      if (success) {
        // Close the AI dialog
        dialogsState.closeAIDialog();
        
        // Refetch the meal plan data
        await coreState.refetch();
        
        const successMessage = language === 'ar'
          ? 'تم إنشاء خطة الوجبات بنجاح!'
          : 'Meal plan generated successfully!';
          
        toast.success(successMessage);
      }

      return success;
    } catch (error: any) {
      console.error('❌ Error in handleGenerateAIPlan:', error);
      const errorMessage = language === 'ar'
        ? 'فشل في إنشاء خطة الوجبات'
        : 'Failed to generate meal plan';
        
      toast.error(errorMessage);
      return false;
    }
  }, [generateMealPlan, dialogsState, coreState, language, hasCredits, userCredits, isPro]);

  return {
    handleGenerateAIPlan,
    isGenerating,
    userCredits,
    isPro,
    hasCredits
  };
};
