
import { useMemo } from 'react';
import { useProfile } from './useProfile';
import { useLanguage } from '@/contexts/LanguageContext';

export interface NutritionContext {
  isPregnant: boolean;
  pregnancyTrimester?: number;
  isBreastfeeding: boolean;
  breastfeedingLevel?: string;
  isMuslimFasting: boolean;
  fastingType?: string;
  hasHealthConditions: boolean;
  healthConditions: string[];
  extraCalories: number;
  needsHydrationReminders: boolean;
  specialMealTiming: boolean;
  nutritionPriorities: string[];
}

export const useLifePhaseNutrition = () => {
  const { profile } = useProfile();
  const { language } = useLanguage();

  const nutritionContext = useMemo((): NutritionContext => {
    if (!profile) {
      return {
        isPregnant: false,
        isBreastfeeding: false,
        isMuslimFasting: false,
        hasHealthConditions: false,
        healthConditions: [],
        extraCalories: 0,
        needsHydrationReminders: false,
        specialMealTiming: false,
        nutritionPriorities: []
      };
    }

    const isPregnant = !!profile.pregnancy_trimester;
    const isBreastfeeding = !!profile.breastfeeding_level;
    const isMuslimFasting = profile.fasting_type === 'ramadan' || profile.fasting_type === 'islamic';
    const hasHealthConditions = (profile.health_conditions || []).length > 0;

    // Calculate extra calories
    let extraCalories = 0;
    if (profile.pregnancy_trimester === 2) extraCalories += 340;
    if (profile.pregnancy_trimester === 3) extraCalories += 450;
    if (profile.breastfeeding_level === 'exclusive') extraCalories += 400;
    if (profile.breastfeeding_level === 'partial') extraCalories += 250;

    // Determine nutrition priorities
    const nutritionPriorities: string[] = [];
    if (isPregnant) nutritionPriorities.push('folic_acid', 'iron', 'calcium');
    if (isBreastfeeding) nutritionPriorities.push('omega3', 'vitamin_d', 'protein');
    if (isMuslimFasting) nutritionPriorities.push('hydration', 'complex_carbs', 'protein');
    if (hasHealthConditions) nutritionPriorities.push('fiber', 'low_sodium', 'antioxidants');

    return {
      isPregnant,
      pregnancyTrimester: profile.pregnancy_trimester,
      isBreastfeeding,
      breastfeedingLevel: profile.breastfeeding_level,
      isMuslimFasting,
      fastingType: profile.fasting_type,
      hasHealthConditions,
      healthConditions: profile.health_conditions || [],
      extraCalories,
      needsHydrationReminders: isBreastfeeding || isMuslimFasting,
      specialMealTiming: isMuslimFasting,
      nutritionPriorities
    };
  }, [profile]);

  const getMealPlanContext = () => ({
    nutritionContext,
    language,
    adjustedCalories: nutritionContext.extraCalories,
    specialInstructions: generateSpecialInstructions()
  });

  const generateSpecialInstructions = (): string[] => {
    const instructions: string[] = [];
    
    if (nutritionContext.isPregnant) {
      instructions.push(
        language === 'ar' 
          ? 'تجنب الأسماك عالية الزئبق والطعام النيء'
          : 'Avoid high-mercury fish and raw foods'
      );
    }
    
    if (nutritionContext.isBreastfeeding) {
      instructions.push(
        language === 'ar'
          ? 'زيادة السوائل والأطعمة الغنية بأوميغا 3'
          : 'Increase fluids and omega-3 rich foods'
      );
    }
    
    if (nutritionContext.isMuslimFasting) {
      instructions.push(
        language === 'ar'
          ? 'وجبات السحور والإفطار مع التركيز على الترطيب'
          : 'Suhoor and Iftar meals with focus on hydration'
      );
    }

    return instructions;
  };

  return {
    nutritionContext,
    getMealPlanContext,
    generateSpecialInstructions
  };
};
