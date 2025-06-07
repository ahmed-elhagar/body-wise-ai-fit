
import { useMemo } from 'react';
import { useProfile } from './useProfile';
import { useAuth } from './useAuth';

export const useOptimizedProfile = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, refetch } = useProfile();

  const profileMetrics = useMemo(() => {
    if (!profile) return null;

    return {
      completionScore: profile.profile_completion_score || 0,
      hasBasicInfo: !!(profile.first_name && profile.last_name && profile.age),
      hasPhysicalInfo: !!(profile.height && profile.weight),
      hasGoals: !!(profile.fitness_goal && profile.activity_level),
      isOnboardingComplete: profile.onboarding_completed || false
    };
  }, [profile]);

  const isProfileComplete = useMemo(() => {
    return profileMetrics?.completionScore >= 80;
  }, [profileMetrics]);

  return {
    user,
    profile,
    profileMetrics,
    isProfileComplete,
    isLoading,
    updateProfile,
    refetch
  };
};
