
import { useAuth } from '@/features/auth/hooks/useAuth';

export const useRole = () => {
  const { user } = useAuth();
  
  // Get role from user metadata or default to normal
  const role = user?.user_metadata?.role || 'normal';
  
  const isAdmin = role === 'admin';
  const isCoach = role === 'coach';
  const isUser = role === 'normal' || !role;

  return {
    isAdmin,
    isCoach,
    isUser,
    role,
  };
};
