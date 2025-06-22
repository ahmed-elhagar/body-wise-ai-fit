
import { useProfile } from "@/features/profile/hooks/useProfile";

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

interface LifePhaseData {
  fasting_type?: string;
  pregnancy_trimester?: number;
  breastfeeding_level?: string;
  condition_start_date?: string;
}

export const useLifePhaseProfile = () => {
  const { profile, updateProfile, isUpdating } = useProfile();

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

  // Create a lifePhase object from profile data
  const lifePhase: LifePhaseData = {
    fasting_type: profile?.fasting_type,
    pregnancy_trimester: profile?.pregnancy_trimester,
    breastfeeding_level: profile?.breastfeeding_level,
    condition_start_date: profile?.condition_start_date
  };

  const updateLifePhaseProfile = async (updates: Partial<LifePhaseData>) => {
    return await updateProfile(updates);
  };

  return {
    profile,
    lifePhase,
    isLoading: isUpdating,
    updateLifePhaseProfile,
    getCurrentSpecialConditions,
    getActiveMuslimFasting,
    getNutritionContext
  };
};
