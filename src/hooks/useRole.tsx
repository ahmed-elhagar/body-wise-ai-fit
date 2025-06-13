
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useRole = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const role = profile?.role || user?.role || 'normal';

  useEffect(() => {
    if (!profileLoading) {
      setIsLoading(false);
    }
  }, [profileLoading]);

  const hasRole = (requiredRole: string): boolean => {
    console.log(`Role check for '${requiredRole}':`, role === requiredRole);
    return role === requiredRole;
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    const hasAny = requiredRoles.includes(role);
    console.log(`Role check for any of [${requiredRoles.join(', ')}]:`, hasAny);
    return hasAny;
  };

  const isAdmin = role === 'admin';
  const isCoach = role === 'coach' || role === 'admin';
  const isNormal = role === 'normal';

  console.log('Role from profile:', role);

  return {
    role,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCoach,
    isNormal
  };
};
