
import { useAIMealPlan } from "./useAIMealPlan";
import { useLifePhaseProfile } from "./useLifePhaseProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export const useEnhancedMealPlan = () => {
  const { generateMealPlan, isGenerating } = useAIMealPlan();
  const { getNutritionContext } = useLifePhaseProfile();
  const { language } = useLanguage();

  const generateMealPlanWithSpecialConditions = async (preferences: any, options?: { weekOffset?: number }) => {
    const nutritionContext = getNutritionContext();
    
    // Enhance preferences with special conditions context
    const enhancedPreferences = {
      ...preferences,
      language,
      nutritionContext,
      weekOffset: options?.weekOffset || 0
    };

    // Show special notification for Muslim fasting
    if (nutritionContext.isMuslimFasting) {
      toast.info(
        language === 'ar' 
          ? 'سيتم إنشاء خطة وجبات مخصصة للصيام الإسلامي'
          : 'Generating Muslim fasting-compatible meal plan'
      );
    }

    console.log('🕌 Generating meal plan with special conditions:', {
      isMuslimFasting: nutritionContext.isMuslimFasting,
      fastingPeriod: nutritionContext.fastingStartDate && nutritionContext.fastingEndDate 
        ? `${nutritionContext.fastingStartDate} to ${nutritionContext.fastingEndDate}`
        : 'Not specified',
      extraCalories: nutritionContext.extraCalories
    });

    return await generateMealPlan(enhancedPreferences, options);
  };

  return {
    generateMealPlan: generateMealPlanWithSpecialConditions,
    isGenerating,
    nutritionContext: getNutritionContext()
  };
};
