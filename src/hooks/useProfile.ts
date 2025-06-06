
import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  fitness_goal?: string;
  activity_level?: string;
  dietary_restrictions?: string[];
  allergies?: string[];
  health_conditions?: string[];
  preferred_foods?: string[];
  location?: string;
  timezone?: string;
  bio?: string;
  profile_visibility?: string;
  onboarding_completed?: boolean;
  role?: 'normal' | 'pro' | 'coach' | 'admin';
  created_at?: string;
  updated_at?: string;
  ai_generations_remaining?: number;
  profile_completion_score?: number;
  nationality?: string;
  body_shape?: string;
  pregnancy_trimester?: number;
  breastfeeding_level?: string;
  fasting_type?: string;
  condition_start_date?: string;
  special_conditions?: any;
  preferred_language?: string;
  last_health_assessment_date?: string;
}

export const useProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<any>(null);
  const fetchingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('useProfile: Auth state changed', { 
      hasUser: !!user,
      userId: user?.id?.substring(0, 8) + '...' || 'none',
      authLoading,
      isSameUser: lastUserIdRef.current === user?.id
    });

    // If auth is still loading, wait
    if (authLoading) {
      console.log('useProfile: Auth still loading, waiting...');
      return;
    }

    // If no user after auth is done loading, clear state
    if (!user?.id) {
      console.log('useProfile: No user ID, clearing profile');
      setProfile(null);
      setIsLoading(false);
      setError(null);
      lastUserIdRef.current = null;
      return;
    }

    // If same user and already fetching or has profile, skip
    if (lastUserIdRef.current === user.id && (fetchingRef.current || profile)) {
      console.log('useProfile: Same user, skipping fetch');
      setIsLoading(false);
      return;
    }

    // User exists and auth is done loading, fetch profile
    const fetchProfile = async () => {
      if (fetchingRef.current) {
        console.log('useProfile: Already fetching, skipping...');
        return;
      }

      try {
        console.log('useProfile: Fetching profile for user:', user.id.substring(0, 8) + '...');
        fetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('useProfile: Error fetching profile:', error);
          setError(error);
          setProfile(null);
        } else {
          console.log('useProfile: Profile fetched successfully', {
            hasProfile: !!data,
            profileId: data?.id?.substring(0, 8) + '...',
            onboardingCompleted: data?.onboarding_completed
          });
          setProfile(data);
          lastUserIdRef.current = user.id;
        }
      } catch (err) {
        console.error('useProfile: Unexpected error:', err);
        setError(err);
        setProfile(null);
      } finally {
        setIsLoading(false);
        fetchingRef.current = false;
      }
    };

    fetchProfile();
  }, [user?.id, authLoading]); // Only depend on user.id and authLoading

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) {
      console.error('useProfile: Cannot update profile - no user ID');
      return { error: 'No user ID available' };
    }

    try {
      console.log('useProfile: Updating profile');
      setIsUpdating(true);
      
      // Filter out any properties that might cause type issues
      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([key, value]) => value !== undefined)
      );
      
      const { data, error } = await supabase
        .from('profiles')
        .update(filteredUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('useProfile: Error updating profile:', error);
        setError(error);
        return { error };
      }

      console.log('useProfile: Profile updated successfully');
      setProfile(data);
      return { data };
    } catch (err) {
      console.error('useProfile: Unexpected error updating profile:', err);
      setError(err);
      return { error: err };
    } finally {
      setIsUpdating(false);
    }
  };

  const refetch = async () => {
    if (!user?.id) return;
    
    try {
      fetchingRef.current = false; // Reset fetch flag
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setError(error);
        setProfile(null);
      } else {
        setProfile(data);
        setError(null);
      }
    } catch (err) {
      setError(err);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    updateProfile,
    refetch
  };
};
