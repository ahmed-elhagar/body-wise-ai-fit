
import { useProfile } from '@/hooks/useProfile';

export const useRole = () => {
  const { profile, isLoading, error } = useProfile();
  
  const role = profile?.role || 'normal';
  const isAdmin = role === 'admin';
  const isCoach = role === 'coach';
  const isNormal = role === 'normal';

  const hasRole = (requiredRole: string) => {
    return role === requiredRole;
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.includes(role);
  };

  return {
    role,
    isAdmin,
    isCoach,
    isNormal,
    isLoading,
    error,
    hasRole,
    hasAnyRole
  };
};
