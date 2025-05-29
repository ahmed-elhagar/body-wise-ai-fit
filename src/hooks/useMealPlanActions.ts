
import { useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMealShuffle } from "@/hooks/useMealShuffle";
import { useAIMealPlan } from "@/hooks/useAIMealPlan";

export const useMealPlanActions = (
  currentWeekPlan: any,
  currentWeekOffset: number,
  aiPreferences: any,
  refetchMealPlan: any
) => {
  const { t, language } = useLanguage();
  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { shuffleMeals, isShuffling } = useMealShuffle();

  // Optimized shuffle handler
  const handleRegeneratePlan = useCallback(async () => {
    if (!currentWeekPlan?.weeklyPlan?.id) {
      toast.error(t('noMealPlanToShuffle') || 'No meal plan found to shuffle');
      return;
    }
    
    try {
      await shuffleMeals(currentWeekPlan.weeklyPlan.id);
      // Refresh the data after successful shuffle
      setTimeout(() => {
        refetchMealPlan?.();
      }, 1000);
    } catch (error) {
      console.error('Failed to shuffle meals:', error);
      toast.error('Failed to shuffle meals. Please try again.');
    }
  }, [currentWeekPlan?.weeklyPlan?.id, shuffleMeals, t, refetchMealPlan]);

  // Enhanced AI generation handler
  const handleGenerateAIPlan = useCallback(async () => {
    try {
      console.log('🚀 Starting AI meal plan generation with preferences:', aiPreferences);
      
      const enhancedPreferences = {
        ...aiPreferences,
        language: language,
        locale: language === 'ar' ? 'ar-SA' : 'en-US'
      };
      
      const result = await generateMealPlan(enhancedPreferences, { weekOffset: currentWeekOffset });
      
      if (result?.success) {
        
        // Force immediate refetch with retries
        let retryCount = 0;
        const maxRetries = 3;
        const retryInterval = 1000;
        
        const attemptRefetch = async () => {
          try {
            await refetchMealPlan?.();
            toast.success(t('generatedSuccessfully') || "✨ Meal plan generated successfully!");
          } catch (error) {
            retryCount++;
            if (retryCount < maxRetries) {
              console.log(`Retrying refetch... (${retryCount}/${maxRetries})`);
              setTimeout(attemptRefetch, retryInterval * retryCount);
            } else {
              console.error('Failed to refetch after multiple attempts');
              toast.warning('Meal plan generated but may need a page refresh to display properly.');
            }
          }
        };
        
        setTimeout(attemptRefetch, 500);
        return true;
      }
      return false;
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      toast.error(t('mealPlan.generationFailed') || "Failed to generate meal plan. Please try again.");
      throw error;
    }
  }, [aiPreferences, language, currentWeekOffset, generateMealPlan, refetchMealPlan, t]);

  return {
    handleRegeneratePlan,
    handleGenerateAIPlan,
    isGenerating,
    isShuffling
  };
};
