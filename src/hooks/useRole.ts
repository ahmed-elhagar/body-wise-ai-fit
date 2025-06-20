
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useRole = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: roleError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (roleError) {
          setError(typeof roleError === 'string' ? roleError : roleError.message || 'Failed to fetch role');
          setRole(null);
        } else {
          setRole(data?.role || 'normal');
          setError(null);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user?.id, authLoading]);

  return {
    role,
    isAdmin: role === 'admin',
    isCoach: role === 'coach',
    isNormal: role === 'normal',
    isLoading: authLoading || isLoading,
    error
  };
};
