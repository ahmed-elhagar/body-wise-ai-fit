
import { useProfile } from './useProfile';
import { useAuth } from './useAuth';

export const useEnhancedProfile = () => {
  const { user } = useAuth();
  const { profile, isLoading, updateProfile, refetch } = useProfile();

  return {
    user,
    profile,
    isLoading,
    updateProfile,
    refetch
  };
};
