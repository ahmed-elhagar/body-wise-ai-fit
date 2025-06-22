import { useState, useEffect } from 'react';

interface FeatureFlags {
  aiCoach: boolean;
  mealPlanGeneration: boolean;
  exerciseTracking: boolean;
  progressAnalytics: boolean;
  socialFeatures: boolean;
  loading: boolean;
}

export const useFeatureFlags = () => {
  const [flags, setFlags] = useState<FeatureFlags>({
    aiCoach: true,
    mealPlanGeneration: true,
    exerciseTracking: true,
    progressAnalytics: true,
    socialFeatures: false,
    loading: true
  });

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      setFlags(prev => ({ ...prev, loading: false }));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleFlag = (flag: keyof Omit<FeatureFlags, 'loading'>) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  return { flags, toggleFlag };
};
