
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for profile fetch');
        return null;
      }
      
      console.log('Fetching profile for user:', user.id, 'Email:', user.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        // Don't throw error if profile doesn't exist yet
        if (error.code === 'PGRST116') {
          console.log('No profile found for user:', user.id, 'returning null');
          return null;
        }
        throw error;
      }
      
      console.log('Profile fetch result for user:', user.id, 'Data:', data);
      
      // Critical: Ensure we're only getting data for the current user
      if (data && data.id !== user.id) {
        console.error('CRITICAL: Profile data mismatch!', {
          requestedUserId: user.id,
          receivedUserId: data.id,
          requestedEmail: user.email,
          receivedEmail: data.email
        });
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // Reduce cache time to 2 minutes for better data freshness
    retry: (failureCount, error: any) => {
      // Don't retry if it's a "no rows" error
      if (error?.code === 'PGRST116') {
        return false;
      }
      return failureCount < 1;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      if (!user?.id) throw new Error('No user ID');

      console.log('Updating profile for user:', user.id, 'with data:', profileData);

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          email: user.email, // Ensure email is consistent
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      console.log('Profile updated successfully for user:', user.id, 'Data:', data);
      return data;
    },
    onSuccess: (data) => {
      // Clear all cached data to prevent stale data issues
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-meal-plan'] });
      queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  };
};
