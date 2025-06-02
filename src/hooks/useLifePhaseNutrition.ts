
import { useAuth } from './useAuth';
import { useMemo } from 'react';

interface NutritionContext {
  isPregnant: boolean;
  isBreastfeeding: boolean;
  isMuslimFasting: boolean;
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  fastingType?: string;
  extraCalories: number;
}

interface MealPlanContext {
  nutritionContext: NutritionContext;
  adjustedCalories: number;
  specialInstructions: string[];
}

export const useLifePhaseNutrition = () => {
  const { user } = useAuth();

  const nutritionContext = useMemo((): NutritionContext => {
    // This would typically come from user profile data
    // For now, returning default values
    return {
      isPregnant: false,
      isBreastfeeding: false,
      isMuslimFasting: false,
      pregnancyTrimester: undefined,
      breastfeedingLevel: undefined,
      fastingType: undefined,
      extraCalories: 0
    };
  }, [user]);

  const getMealPlanContext = (): MealPlanContext => {
    const specialInstructions: string[] = [];
    let adjustedCalories = 0;

    if (nutritionContext.isPregnant && nutritionContext.pregnancyTrimester) {
      if (nutritionContext.pregnancyTrimester === 2) {
        adjustedCalories = 340;
        specialInstructions.push('Include extra folic acid and calcium');
      } else if (nutritionContext.pregnancyTrimester === 3) {
        adjustedCalories = 450;
        specialInstructions.push('Focus on iron and protein intake');
      }
    }

    if (nutritionContext.isBreastfeeding) {
      if (nutritionContext.breastfeedingLevel === 'exclusive') {
        adjustedCalories = 400;
        specialInstructions.push('Increase fluid intake and healthy fats');
      } else if (nutritionContext.breastfeedingLevel === 'partial') {
        adjustedCalories = 250;
        specialInstructions.push('Maintain balanced nutrition for milk production');
      }
    }

    if (nutritionContext.isMuslimFasting) {
      specialInstructions.push('Plan meals for pre-dawn (Suhoor) and sunset (Iftar)');
      specialInstructions.push('Focus on hydrating foods and complex carbohydrates');
    }

    return {
      nutritionContext,
      adjustedCalories,
      specialInstructions
    };
  };

  return {
    nutritionContext,
    getMealPlanContext
  };
};
