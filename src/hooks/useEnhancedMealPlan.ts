
import { useEnhancedAIMealPlan } from "./meal-plan/useEnhancedAIMealPlan";
import { useLifePhaseNutrition } from "./useLifePhaseNutrition";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEnhancedErrorSystem } from "./useEnhancedErrorSystem";
import { toast } from "sonner";

export const useEnhancedMealPlan = () => {
  const { generateMealPlan, isGenerating } = useEnhancedAIMealPlan();
  const { getMealPlanContext } = useLifePhaseNutrition();
  const { language } = useLanguage();
  const { withErrorBoundary } = useEnhancedErrorSystem();

  const generateMealPlanWithLifePhase = withErrorBoundary(
    async (preferences: any, options?: { weekOffset?: number }) => {
      const mealPlanContext = getMealPlanContext();
      
      // Enhanced preferences with life phase context
      const enhancedPreferences = {
        ...preferences,
        ...mealPlanContext,
        weekOffset: options?.weekOffset || 0,
        includeSnacks: preferences.includeSnacks !== false
      };

      console.log('🍽️ Generating life-phase aware meal plan:', {
        nutritionContext: mealPlanContext.nutritionContext,
        adjustedCalories: mealPlanContext.adjustedCalories,
        specialInstructions: mealPlanContext.specialInstructions,
        includeSnacks: enhancedPreferences.includeSnacks
      });

      // Show special notifications for life phase
      if (mealPlanContext.nutritionContext.isMuslimFasting) {
        toast.info(
          language === 'ar' 
            ? 'سيتم إنشاء خطة وجبات مخصصة للصيام الإسلامي مع توقيت الإفطار والسحور'
            : 'Generating Islamic fasting-compatible meal plan with Iftar and Suhoor timing'
        );
      }

      if (mealPlanContext.nutritionContext.isPregnant) {
        toast.info(
          language === 'ar'
            ? `جاري إنشاء خطة وجبات للحمل مع ${mealPlanContext.adjustedCalories} سعرة إضافية`
            : `Generating pregnancy meal plan with ${mealPlanContext.adjustedCalories} extra calories`
        );
      }

      if (mealPlanContext.nutritionContext.isBreastfeeding) {
        toast.info(
          language === 'ar'
            ? `جاري إنشاء خطة وجبات للرضاعة مع ${mealPlanContext.adjustedCalories} سعرة إضافية`
            : `Generating breastfeeding meal plan with ${mealPlanContext.adjustedCalories} extra calories`
        );
      }

      const result = await generateMealPlan(enhancedPreferences, options);
      
      if (result) {
        toast.success(
          language === 'ar'
            ? 'تم إنشاء خطة الوجبات مع مراعاة احتياجاتك الخاصة!'
            : 'Meal plan generated with your special nutritional needs!'
        );
      }

      return result;
    },
    {
      operation: 'enhanced_meal_plan_generation',
      retryable: true,
      severity: 'high'
    }
  );

  return {
    generateMealPlan: generateMealPlanWithLifePhase,
    isGenerating,
    nutritionContext: getMealPlanContext().nutritionContext
  };
};
