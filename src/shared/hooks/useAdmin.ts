
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface AdminData {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAdmin = (): AdminData => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        setIsAdmin(data?.role === 'admin');
      } catch (err) {
        console.error('Error checking admin status:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  return { isAdmin, isLoading, error };
};
