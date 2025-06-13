
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  onboarding_completed?: boolean;
  ai_generations_remaining?: number;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Profile fetch error:', error);
          setError(error);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return { error: new Error('No user ID') };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        setError(error);
        return { error };
      }

      setProfile(data);
      return { data };
    } catch (err) {
      setError(err as Error);
      return { error: err as Error };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refetch: () => {
      if (user?.id) {
        setIsLoading(true);
        // Trigger refetch by updating dependency
      }
    }
  };
};
