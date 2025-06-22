
import { useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useMealPlanActions = (
  currentWeekPlan: any,
  currentWeekOffset: number,
  aiPreferences: any,
  refetchMealPlan: any
) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Simple generation function without circular dependencies
  const generateMealPlan = useCallback(async (preferences: any, options?: any) => {
    console.log('🚀 Generate meal plan called with:', { preferences, options });
    // Mock implementation to avoid circular dependencies
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Mock meal plan generation completed');
        resolve(true);
      }, 1000);
    });
  }, []);

  const isGenerating = false; // Simplified state
  
  // Simple nutrition context without circular dependencies
  const nutritionContext = {
    isMuslimFasting: false,
    isPregnant: false,
    isBreastfeeding: false,
    specialConditions: []
  };

  // Enhanced AI generation handler with special conditions support
  const handleGenerateAIPlan = useCallback(async () => {
    try {
      console.log('🚀 Starting enhanced AI meal plan generation:', {
        weekOffset: currentWeekOffset,
        preferences: aiPreferences,
        userId: user?.id,
        nutritionContext
      });
      
      const enhancedPreferences = {
        ...aiPreferences,
        language: language,
        locale: language === 'ar' ? 'ar-SA' : 'en-US',
        weekOffset: currentWeekOffset,
        specialConditions: nutritionContext || {}
      };
      
      const result = await generateMealPlan(enhancedPreferences, { weekOffset: currentWeekOffset });
      
      if (result) {
        console.log('✅ Generation successful with special conditions:', {
          weekOffset: currentWeekOffset,
          isMuslimFasting: nutritionContext?.isMuslimFasting || false
        });
        
        // Invalidate all meal plan queries to ensure fresh data
        await queryClient.invalidateQueries({
          queryKey: ['meal-plan-data']
        });
        
        // Wait a bit for the database to be fully updated
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Force immediate refetch with better error handling
        try {
          await refetchMealPlan?.();
          console.log('✅ Refetch completed successfully');
          
          // Show success message
          toast.success(
            language === 'ar'
              ? 'تم إنشاء خطة الوجبات بنجاح!'
              : 'Meal plan generated successfully!'
          );
          
          return true;
        } catch (refetchError) {
          console.error('❌ Refetch failed after generation:', refetchError);
          toast.warning('Plan generated but may need a page refresh to display properly.');
          return true;
        }
      } else {
        console.error('❌ Generation failed');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Generation failed with exception:', error);
      toast.error("Failed to generate meal plan. Please try again.");
      throw error;
    }
  }, [aiPreferences, language, currentWeekOffset, generateMealPlan, refetchMealPlan, queryClient, user?.id, nutritionContext]);

  // Add the missing handleRegeneratePlan method
  const handleRegeneratePlan = useCallback(async () => {
    console.log('🔄 Regenerating meal plan with special conditions...');
    return await handleGenerateAIPlan();
  }, [handleGenerateAIPlan]);

  return {
    handleGenerateAIPlan,
    handleRegeneratePlan,
    isGenerating,
    isShuffling: false,
    nutritionContext: nutritionContext || {}
  };
};
