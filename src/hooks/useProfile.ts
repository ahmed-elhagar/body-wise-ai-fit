
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  nationality?: string;
  body_shape?: string;
  fitness_goal?: string;
  activity_level?: string;
  dietary_restrictions?: string[];
  allergies?: string[];
  health_conditions?: string[];
  preferred_foods?: string[];
  preferred_language?: string;
  onboarding_completed?: boolean;
  profile_completion_score?: number;
  ai_generations_remaining?: number;
  role?: 'normal' | 'admin' | 'coach' | 'pro';
  fasting_type?: string;
  pregnancy_trimester?: number;
  breastfeeding_level?: string;
  condition_start_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setError(error.message);
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user?.id) return { error: 'No user authenticated' };

    try {
      setIsUpdating(true);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error: error.message };
      }

      setProfile(data);
      return { data };
    } catch (err) {
      console.error('Profile update error:', err);
      return { error: 'Failed to update profile' };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    refetch: () => {
      if (user?.id) {
        setIsLoading(true);
        // Trigger useEffect to refetch
        setProfile(null);
      }
    }
  };
};
