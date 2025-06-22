
import { useState } from 'react';

export interface FeatureFlags {
  email_confirmation: boolean;
  life_phase_nutrition: boolean;
  aiCoach: boolean;
  mealPlanGeneration: boolean;
  exerciseTracking: boolean;
  progressAnalytics: boolean;
  socialFeatures: boolean;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>({
    email_confirmation: true,
    life_phase_nutrition: false,
    aiCoach: true,
    mealPlanGeneration: true,
    exerciseTracking: true,
    progressAnalytics: true,
    socialFeatures: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const toggleFlag = (flag: keyof FeatureFlags) => {
    setIsLoading(true);
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
    setIsLoading(false);
  };

  return {
    flags,
    isLoading,
    toggleFlag
  };
};
