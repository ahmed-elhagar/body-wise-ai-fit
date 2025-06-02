
import { useProfile } from "./useProfile";

interface LifePhaseContext {
  fastingType?: string;
  pregnancyTrimester?: number;
  breastfeedingLevel?: string;
  extraCalories: number;
  needsHydrationReminders: boolean;
  isRamadan: boolean;
  isMuslimFasting: boolean;
  fastingStartDate?: string;
  fastingEndDate?: string;
}

export const useLifePhaseProfile = () => {
  const { profile } = useProfile();

  const getCurrentSpecialConditions = () => {
    if (!profile?.special_conditions || !Array.isArray(profile.special_conditions)) {
      return [];
    }
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return profile.special_conditions.filter((condition: any) => {
      return condition.startDate <= todayStr && condition.endDate >= todayStr;
    });
  };

  const getActiveMuslimFasting = () => {
    const activeConditions = getCurrentSpecialConditions();
    return activeConditions.find((condition: any) => 
      condition.type === 'muslim_fasting'
    );
  };

  const getNutritionContext = (): LifePhaseContext => {
    const muslimFasting = getActiveMuslimFasting();
    
    let extraCalories = 0;
    
    // Calculate extra calories based on life phase
    if (profile?.pregnancy_trimester === 2) extraCalories += 340;
    if (profile?.pregnancy_trimester === 3) extraCalories += 450;
    if (profile?.breastfeeding_level === 'exclusive') extraCalories += 400;
    if (profile?.breastfeeding_level === 'partial') extraCalories += 250;

    return {
      fastingType: profile?.fasting_type || (muslimFasting ? 'ramadan' : undefined),
      pregnancyTrimester: profile?.pregnancy_trimester,
      breastfeedingLevel: profile?.breastfeeding_level,
      extraCalories,
      needsHydrationReminders: !!(muslimFasting || profile?.breastfeeding_level),
      isRamadan: profile?.fasting_type === 'ramadan' || !!muslimFasting,
      isMuslimFasting: !!muslimFasting,
      fastingStartDate: muslimFasting?.startDate,
      fastingEndDate: muslimFasting?.endDate
    };
  };

  return {
    profile,
    getCurrentSpecialConditions,
    getActiveMuslimFasting,
    getNutritionContext
  };
};
