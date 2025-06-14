
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlags {
  email_confirmation: boolean;
  life_phase_nutrition: boolean;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>({
    email_confirmation: false,
    life_phase_nutrition: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const { data, error } = await supabase
          .from('feature_flags')
          .select('*')
          .single();
        
        if (error) throw error;
        setFlags(data);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const toggleFlag = async (flagName: keyof FeatureFlags) => {
    try {
      const newValue = !flags[flagName];
      const { error } = await supabase
        .from('feature_flags')
        .update({ [flagName]: newValue })
        .eq('id', 1);
      
      if (error) throw error;
      
      setFlags(prev => ({ ...prev, [flagName]: newValue }));
    } catch (error) {
      console.error('Error toggling feature flag:', error);
    }
  };

  return {
    flags,
    isLoading,
    toggleFlag
  };
};
