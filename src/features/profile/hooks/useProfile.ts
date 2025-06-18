
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setError(error);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const updateProfile = async (updates: any) => {
    if (!user?.id) return { error: new Error('No user ID'), data: null };

    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error, data: null };
      }
      
      setProfile(data);
      return { error: null, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error as Error, data: null };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    updateProfile
  };
};
