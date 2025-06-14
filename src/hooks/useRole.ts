
import { useProfile } from '@/hooks/useProfile';

export const useRole = () => {
  const { profile, isLoading } = useProfile();
  
  const role = profile?.role || 'normal';
  const isAdmin = role === 'admin';
  const isCoach = role === 'coach';
  const isNormal = role === 'normal';

  return {
    role,
    isAdmin,
    isCoach,
    isNormal,
    isLoading
  };
};
