
import { useState } from 'react';
import { useAuth } from './useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useMealPlanAIActions = (coreState: any, dialogsState: any) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const handleGenerateAIPlan = async (): Promise<boolean> => {
    if (!user?.id) {
      toast.error(
        language === 'ar' 
          ? 'يجب تسجيل الدخول أولاً' 
          : 'Please sign in first'
      );
      return false;
    }

    try {
      coreState.setAiLoadingState({
        isGenerating: true,
        currentStep: 'Initializing AI generation...',
        progress: 10
      });

      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      coreState.setAiLoadingState({
        isGenerating: false,
        currentStep: '',
        progress: 0
      });

      toast.success(
        language === 'ar'
          ? 'تم إنشاء الخطة بنجاح'
          : 'Meal plan generated successfully!'
      );

      // Close the AI dialog
      dialogsState.closeAIDialog();
      
      // Refetch the meal plan
      await coreState.refetch();
      
      return true;
    } catch (error) {
      console.error('❌ Error generating AI meal plan:', error);
      
      coreState.setAiLoadingState({
        isGenerating: false,
        currentStep: '',
        progress: 0
      });

      toast.error(
        language === 'ar'
          ? 'فشل في إنشاء الخطة'
          : 'Failed to generate meal plan'
      );
      
      return false;
    }
  };

  return {
    handleGenerateAIPlan
  };
};
