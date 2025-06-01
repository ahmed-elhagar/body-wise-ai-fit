
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useRole = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      setIsLoading(false);
    }
  }, [authLoading, profileLoading]);

  // Get role from profile data first, then fallback to user metadata
  const getUserRole = () => {
    if (!user) return 'guest';
    
    // Check profile role first (most reliable)
    if (profile?.role) {
      console.log('Role from profile:', profile.role);
      return profile.role;
    }
    
    // Fallback to user metadata
    const metadataRole = user.user_metadata?.role;
    const directRole = user.role;
    
    const finalRole = metadataRole || directRole || 'normal';
    console.log('Role from metadata/fallback:', finalRole);
    return finalRole;
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
    hasAnyRole: (roles: string[]) => roles.includes(role),
    refetch: () => {
      // Force re-evaluation of role
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 100);
    }
  };
};
