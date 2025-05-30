
import { useState, useEffect } from 'react';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export interface LifePhaseData {
  fasting_type?: string;
  pregnancy_trimester?: number;
  breastfeeding_level?: string;
  condition_start_date?: string;
}

export const useLifePhaseProfile = () => {
  const { profile, updateProfile } = useProfile();
  
  const [lifePhase, setLifePhase] = useState<LifePhaseData>({
    fasting_type: '',
    pregnancy_trimester: 0,
    breastfeeding_level: '',
    condition_start_date: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setLifePhase({
        fasting_type: profile.fasting_type || '',
        pregnancy_trimester: profile.pregnancy_trimester || 0,
        breastfeeding_level: profile.breastfeeding_level || '',
        condition_start_date: profile.condition_start_date || '',
      });
    }
  }, [profile]);

  const updateLifePhaseProfile = async (updates: Partial<LifePhaseData>) => {
    setIsLoading(true);
    try {
      const updatedLifePhase = { ...lifePhase, ...updates };
      setLifePhase(updatedLifePhase);
      
      await updateProfile(updatedLifePhase);
      toast.success('Life phase information updated successfully');
    } catch (error) {
      console.error('Error updating life phase profile:', error);
      toast.error('Failed to update life phase information');
    } finally {
      setIsLoading(false);
    }
  };

  const getNutritionContext = () => {
    const context: any = {};
    
    if (lifePhase.pregnancy_trimester && lifePhase.pregnancy_trimester > 0) {
      context.pregnancy_trimester = lifePhase.pregnancy_trimester;
    }
    
    if (lifePhase.breastfeeding_level && lifePhase.breastfeeding_level !== 'none') {
      context.breastfeeding_level = lifePhase.breastfeeding_level;
    }
    
    if (lifePhase.fasting_type && lifePhase.fasting_type !== 'none') {
      context.fasting_type = lifePhase.fasting_type;
    }
    
    return context;
  };

  return {
    lifePhase,
    isLoading,
    updateLifePhaseProfile,
    getNutritionContext
  };
};
