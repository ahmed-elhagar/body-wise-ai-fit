
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useProfile = () => {
  const { profile, isLoading } = useAuth();

  return {
    profile,
    isLoading,
    hasProfile: !!profile,
    isProfileComplete: (profile?.profile_completion_score || 0) >= 80,
  };
};
