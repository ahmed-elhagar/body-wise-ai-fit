
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useLifePhaseProfile = () => {
  const { user } = useAuth();

  const { data: lifePhaseProfile, isLoading, error } = useQuery({
    queryKey: ['life-phase-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_life_phases')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getNutritionContext = () => {
    if (!lifePhaseProfile) {
      return {
        is_pregnant: false,
        is_breastfeeding: false,
        pregnancy_stage: null,
        breastfeeding_level: null,
        activity_level: null,
        pregnancyTrimester: null,
        breastfeedingLevel: null,
        fastingType: null,
        isMuslimFasting: false,
        extraCalories: 0
      };
    }
    
    return {
      is_pregnant: lifePhaseProfile.is_pregnant || false,
      is_breastfeeding: lifePhaseProfile.is_breastfeeding || false,
      pregnancy_stage: lifePhaseProfile.pregnancy_stage,
      breastfeeding_level: lifePhaseProfile.breastfeeding_level,
      activity_level: lifePhaseProfile.activity_level,
      // Add camelCase aliases for compatibility
      pregnancyTrimester: lifePhaseProfile.pregnancy_stage,
      breastfeedingLevel: lifePhaseProfile.breastfeeding_level,
      fastingType: lifePhaseProfile.fasting_type || null,
      isMuslimFasting: lifePhaseProfile.is_muslim_fasting || false,
      extraCalories: lifePhaseProfile.extra_calories || 0,
      fastingStartDate: lifePhaseProfile.fasting_start_date || null,
      fastingEndDate: lifePhaseProfile.fasting_end_date || null
    };
  };

  return {
    lifePhaseProfile,
    isLoading,
    error,
    getNutritionContext
  };
};
