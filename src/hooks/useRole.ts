
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading]);

  // Get role from user metadata or default role
  const getUserRole = () => {
    if (!user) return 'guest';
    
    // Check multiple places for role information
    const metadataRole = user.user_metadata?.role;
    const directRole = user.role;
    
    return metadataRole || directRole || 'normal';
  };

  const role = getUserRole();
  
  return {
    role,
    isAdmin: role === 'admin',
    isCoach: role === 'coach' || role === 'admin',
    isNormal: role === 'normal',
    isGuest: role === 'guest',
    isPro: role === 'pro' || role === 'admin',
    isLoading,
    hasRole: (checkRole: string) => role === checkRole,
    hasAnyRole: (roles: string[]) => roles.includes(role)
  };
};
