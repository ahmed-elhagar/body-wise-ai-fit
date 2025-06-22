
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useProfile = () => {
  const { user, loading } = useAuth();

  return {
    profile: user,
    isLoading: loading,
    hasProfile: !!user,
    isProfileComplete: true, // Simplified for now
  };
};
