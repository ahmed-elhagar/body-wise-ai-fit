
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface NutritionContext {
  isPregnant: boolean;
  pregnancyTrimester?: number;
  isBreastfeeding: boolean;
  breastfeedingLevel?: string;
  isMuslimFasting: boolean;
  fastingType?: string;
  fastingStartDate?: string;
  fastingEndDate?: string;
  hasHealthConditions: boolean;
  healthConditions: string[];
  hasSpecialConditions: boolean;
  specialConditions: string[];
  extraCalories: number;
}

export const useLifePhaseProfile = () => {
  const { user } = useAuth();
  const [nutritionContext, setNutritionContext] = useState<NutritionContext>({
    isPregnant: false,
    isBreastfeeding: false,
    isMuslimFasting: false,
    hasHealthConditions: false,
    healthConditions: [],
    hasSpecialConditions: false,
    specialConditions: [],
    extraCalories: 0
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchLifePhaseData = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          const context: NutritionContext = {
            isPregnant: !!profile.pregnancy_trimester,
            pregnancyTrimester: profile.pregnancy_trimester,
            isBreastfeeding: !!profile.breastfeeding_level,
            breastfeedingLevel: profile.breastfeeding_level,
            isMuslimFasting: profile.fasting_type === 'muslim' || false,
            fastingType: profile.fasting_type,
            hasHealthConditions: profile.health_conditions?.length > 0 || false,
            healthConditions: profile.health_conditions || [],
            hasSpecialConditions: profile.special_conditions?.length > 0 || false,
            specialConditions: profile.special_conditions || [],
            extraCalories: 0
          };

          // Calculate extra calories based on life phase
          if (context.pregnancyTrimester === 2) {
            context.extraCalories += 340;
          } else if (context.pregnancyTrimester === 3) {
            context.extraCalories += 450;
          }

          if (context.breastfeedingLevel === 'exclusive') {
            context.extraCalories += 400;
          } else if (context.breastfeedingLevel === 'partial') {
            context.extraCalories += 250;
          }

          setNutritionContext(context);
        }
      } catch (error) {
        console.error('Error fetching life phase data:', error);
      }
    };

    fetchLifePhaseData();
  }, [user?.id]);

  const getNutritionContext = () => nutritionContext;

  return {
    nutritionContext,
    getNutritionContext
  };
};
