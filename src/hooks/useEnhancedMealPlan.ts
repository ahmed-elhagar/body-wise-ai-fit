
import { useEnhancedAIMealPlan } from "./meal-plan/useEnhancedAIMealPlan";
import { useLifePhaseProfile } from "./useLifePhaseProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export const useEnhancedMealPlan = () => {
  const { generateMealPlan, isGenerating } = useEnhancedAIMealPlan();
  const { getNutritionContext } = useLifePhaseProfile();
  const { language } = useLanguage();

  const generateMealPlanWithSpecialConditions = async (preferences: any, options?: { weekOffset?: number }) => {
    const nutritionContext = getNutritionContext();
    
    // Enhance preferences with special conditions context
    const enhancedPreferences = {
      ...preferences,
      language,
      nutritionContext,
      weekOffset: options?.weekOffset || 0,
      includeSnacks: preferences.includeSnacks !== false // Default to true if not specified
    };

    // Show special notification for Muslim fasting
    if (nutritionContext.isMuslimFasting) {
      toast.info(
        language === 'ar' 
          ? 'سيتم إنشاء خطة وجبات مخصصة للصيام الإسلامي'
          : 'Generating Muslim fasting-compatible meal plan'
      );
    }

    // Show notification about meal count
    const mealCount = enhancedPreferences.includeSnacks ? 5 : 3;
    console.log(`🍽️ Generating ${mealCount} meals per day (snacks: ${enhancedPreferences.includeSnacks})`);

    console.log('🕌 Generating meal plan with enhanced conditions:', {
      isMuslimFasting: nutritionContext.isMuslimFasting,
      fastingPeriod: nutritionContext.fastingStartDate && nutritionContext.fastingEndDate 
        ? `${nutritionContext.fastingStartDate} to ${nutritionContext.fastingEndDate}`
        : 'Not specified',
      extraCalories: nutritionContext.extraCalories,
      includeSnacks: enhancedPreferences.includeSnacks,
      mealsPerDay: mealCount
    });

    return await generateMealPlan(enhancedPreferences, options);
  };

  return {
    generateMealPlan: generateMealPlanWithSpecialConditions,
    isGenerating,
    nutritionContext: getNutritionContext()
  };
};
