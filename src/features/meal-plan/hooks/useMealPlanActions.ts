
import { useCallback } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEnhancedMealPlan } from "@/hooks/useEnhancedMealPlan";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

export const useMealPlanActions = (
  currentWeekPlan: any,
  currentWeekOffset: number,
  aiPreferences: any,
  refetchMealPlan: any
) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { generateMealPlan, isGenerating, nutritionContext } = useEnhancedMealPlan();

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
        
        await queryClient.invalidateQueries({
          queryKey: ['weekly-meal-plan']
        });
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        try {
          await refetchMealPlan?.();
          console.log('✅ Refetch completed successfully');
          
          if (nutritionContext?.isMuslimFasting) {
            toast.success(
              language === 'ar'
                ? 'تم إنشاء خطة وجبات متوافقة مع الصيام الإسلامي بنجاح!'
                : 'Muslim fasting-compatible meal plan generated successfully!'
            );
          } else {
            toast.success(
              language === 'ar'
                ? 'تم إنشاء خطة الوجبات بنجاح!'
                : 'Meal plan generated successfully!'
            );
          }
          
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
