
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface LifePhaseProfile {
  fasting_type?: string;
  pregnancy_trimester?: number;
  breastfeeding_level?: string;
  condition_start_date?: Date;
}

export const useLifePhaseProfile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [lifePhase, setLifePhase] = useState<LifePhaseProfile>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchLifePhaseProfile();
    }
  }, [user?.id]);

  const fetchLifePhaseProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('fasting_type, pregnancy_trimester, breastfeeding_level, condition_start_date')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setLifePhase({
        fasting_type: data.fasting_type || undefined,
        pregnancy_trimester: data.pregnancy_trimester || undefined,
        breastfeeding_level: data.breastfeeding_level || undefined,
        condition_start_date: data.condition_start_date ? new Date(data.condition_start_date) : undefined
      });
    } catch (error) {
      console.error('Error fetching life phase profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLifePhaseProfile = async (updates: Partial<LifePhaseProfile>) => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const updateData = {
        fasting_type: updates.fasting_type || null,
        pregnancy_trimester: updates.pregnancy_trimester || null,
        breastfeeding_level: updates.breastfeeding_level || null,
        condition_start_date: updates.condition_start_date?.toISOString().split('T')[0] || null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      setLifePhase(prev => ({ ...prev, ...updates }));
      toast.success(t('profile.lifePhase.updated') || 'Life phase profile updated successfully');
    } catch (error) {
      console.error('Error updating life phase profile:', error);
      toast.error(t('profile.lifePhase.updateError') || 'Failed to update life phase profile');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateCalorieOffset = () => {
    if (lifePhase.pregnancy_trimester === 2) return 340;
    if (lifePhase.pregnancy_trimester === 3) return 450;
    if (lifePhase.breastfeeding_level === 'exclusive') return 400;
    if (lifePhase.breastfeeding_level === 'partial') return 250;
    return 0;
  };

  const getNutritionContext = () => {
    return {
      fastingType: lifePhase.fasting_type,
      pregnancyTrimester: lifePhase.pregnancy_trimester,
      breastfeedingLevel: lifePhase.breastfeeding_level,
      extraCalories: calculateCalorieOffset(),
      conditionStartDate: lifePhase.condition_start_date,
      needsHydrationReminders: !!(lifePhase.fasting_type === 'ramadan' || lifePhase.breastfeeding_level),
      isRamadan: lifePhase.fasting_type === 'ramadan'
    };
  };

  return {
    lifePhase,
    isLoading,
    isSaving,
    updateLifePhaseProfile,
    calculateCalorieOffset,
    getNutritionContext
  };
};
