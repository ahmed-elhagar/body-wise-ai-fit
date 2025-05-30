
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlags {
  life_phase_nutrition: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  life_phase_nutrition: false
};

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        // In a real implementation, this would fetch from a remote config service
        // For now, we'll use a simple approach with environment or default values
        const lifePhaseEnabled = localStorage.getItem('feature_life_phase_nutrition') === 'true';
        
        setFlags({
          life_phase_nutrition: lifePhaseEnabled
        });
      } catch (error) {
        console.error('Failed to fetch feature flags:', error);
        setFlags(DEFAULT_FLAGS);
      } finally {
        setLoading(false);
      }
    };

    fetchFlags();
  }, []);

  const toggleFlag = (flagName: keyof FeatureFlags) => {
    const newValue = !flags[flagName];
    localStorage.setItem(`feature_${flagName}`, newValue.toString());
    setFlags(prev => ({ ...prev, [flagName]: newValue }));
  };

  return { flags, loading, toggleFlag };
};
