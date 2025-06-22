
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useRole = () => {
  const { user, profile } = useAuth();
  
  const isAdmin = profile?.role === 'admin';
  const isCoach = profile?.role === 'coach';
  const isUser = profile?.role === 'normal' || !profile?.role;

  return {
    isAdmin,
    isCoach,
    isUser,
    role: profile?.role || 'normal',
  };
};
