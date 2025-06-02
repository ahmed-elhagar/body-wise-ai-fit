
import { useCallback } from "react";
import { toast } from 'sonner';

export const useMealPlanAIActions = (
  coreState: any,
  dialogsState: any
) => {
  // Enhanced AI generation with proper loading state management
  const handleGenerateAIPlan = useCallback(async (): Promise<boolean> => {
    // Check credits first
    if (coreState.userCredits <= 0) {
      toast.error(
        coreState.language === 'ar' 
          ? 'لا توجد أرصدة ذكاء اصطناعي متبقية' 
          : 'No AI credits remaining'
      );
      return false;
    }

    try {
      console.log('🚀 Starting AI meal plan generation:', {
        weekOffset: coreState.currentWeekOffset,
        preferences: dialogsState.aiPreferences,
        userId: coreState.user?.id,
        nutritionContext: coreState.nutritionContext,
        userCredits: coreState.userCredits
      });
      
      // Set AI loading state
      coreState.setAiLoadingState({
        isGenerating: true,
        currentStep: 'Initializing generation...',
        progress: 0
      });
      
      // Include preferences with current week offset
      const enhancedPreferences = {
        ...dialogsState.aiPreferences,
        weekOffset: coreState.currentWeekOffset,
        language: coreState.language
      };
      
      // Update loading steps during generation
      const updateProgress = (step: string, progress: number) => {
        coreState.setAiLoadingState(prev => ({
          ...prev,
          currentStep: step,
          progress
        }));
      };
      
      updateProgress('Analyzing your profile...', 25);
      
      const result = await coreState.generateMealPlan(enhancedPreferences, { 
        weekOffset: coreState.currentWeekOffset 
      });
      
      if (result) {
        console.log('✅ Generation successful:', {
          weekOffset: coreState.currentWeekOffset
        });
        
        updateProgress('Saving meal plan...', 75);
        
        // Invalidate queries and refetch
        await coreState.queryClient.invalidateQueries({
          queryKey: ['weekly-meal-plan']
        });
        
        // Wait for database update
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        updateProgress('Finalizing...', 100);
        
        // Refetch data
        await coreState.refetch?.();
        
        // Close dialog and clear loading state
        dialogsState.closeAIDialog();
        coreState.setAiLoadingState({
          isGenerating: false,
          currentStep: '',
          progress: 0
        });
        
        // Show success message
        toast.success(
          coreState.language === 'ar'
            ? 'تم إنشاء خطة الوجبات بنجاح!'
            : 'Meal plan generated successfully!'
        );
        
        return true;
      }
      
      throw new Error('Generation failed');
    } catch (error) {
      console.error('❌ Generation failed:', error);
      
      // Clear loading state on error
      coreState.setAiLoadingState({
        isGenerating: false,
        currentStep: '',
        progress: 0
      });
      
      toast.error(
        coreState.language === 'ar'
          ? 'حدث خطأ أثناء الإنشاء'
          : 'An error occurred during generation'
      );
      return false;
    }
  }, [
    dialogsState.aiPreferences, 
    coreState.currentWeekOffset, 
    coreState.generateMealPlan, 
    coreState.refetch, 
    coreState.queryClient, 
    coreState.user?.id, 
    coreState.nutritionContext,
    coreState.userCredits,
    coreState.language,
    coreState.setAiLoadingState,
    dialogsState.closeAIDialog
  ]);

  return {
    handleGenerateAIPlan
  };
};
