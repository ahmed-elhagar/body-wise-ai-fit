
import { useState, useEffect } from 'react';

interface FeatureFlags {
  email_confirmation: boolean;
  life_phase_nutrition: boolean;
  enhanced_analytics: boolean;
  social_features: boolean;
  advanced_meal_planning: boolean;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>({
    email_confirmation: false, // Default to false for easier testing
    life_phase_nutrition: true,
    enhanced_analytics: true,
    social_features: false,
    advanced_meal_planning: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch feature flags from your backend
    // For now, we'll use hardcoded values
    setIsLoading(false);
  }, []);

  const toggleFlag = (flagName: keyof FeatureFlags) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  return {
    flags,
    isLoading,
    toggleFlag
  };
};
