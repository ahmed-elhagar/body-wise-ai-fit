
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useRole = () => {
  const { user, loading: authLoading, error: authError } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle loading states
    if (!authLoading && !profileLoading) {
      setIsLoading(false);
    }
    
    // Handle errors
    if (authError || profileError) {
      setError(authError?.message || profileError || 'Authentication error');
    } else {
      setError(null);
    }
  }, [authLoading, profileLoading, authError, profileError]);

  // Enhanced role detection with fallback chain
  const getUserRole = () => {
    if (!user) return 'guest';
    
    try {
      // Priority 1: Profile role (most reliable)
      if (profile?.role) {
        console.log('Role from profile:', profile.role);
        return profile.role;
      }
      
      // Priority 2: User metadata role
      const metadataRole = user.user_metadata?.role;
      if (metadataRole) {
        console.log('Role from user metadata:', metadataRole);
        return metadataRole;
      }
      
      // Priority 3: Direct user role
      const directRole = (user as any).role;
      if (directRole) {
        console.log('Role from user object:', directRole);
        return directRole;
      }
      
      // Default fallback
      console.log('Using default role: normal');
      return 'normal';
    } catch (err) {
      console.error('Error determining user role:', err);
      setError('Failed to determine user role');
      return 'normal';
    }
  };

  const role = getUserRole();
  
  // Enhanced role checking functions with error handling
  const hasRole = (checkRole: string): boolean => {
    try {
      return role === checkRole;
    } catch (err) {
      console.error('Error checking role:', err);
      return false;
    }
  };

  const hasAnyRole = (roles: string[]): boolean => {
    try {
      return roles.includes(role);
    } catch (err) {
      console.error('Error checking multiple roles:', err);
      return false;
    }
  };

  // Enhanced refetch with error handling
  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add small delay to allow for state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error refetching role:', err);
      setError('Failed to refresh role information');
      setIsLoading(false);
    }
  };

  return {
    role,
    isAdmin: role === 'admin',
    isCoach: role === 'coach' || role === 'admin',
    isNormal: role === 'normal',
    isGuest: role === 'guest',
    isPro: role === 'pro' || role === 'admin',
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    refetch
  };
};
