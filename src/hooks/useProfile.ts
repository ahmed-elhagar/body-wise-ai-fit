
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
        console.log('useProfile - No user ID available for profile fetch');
        return null;
      }
      
      console.log('useProfile - Fetching profile for user:', user.id, 'Email:', user.email);
      
      try {
        // First verify the user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.id !== user.id) {
          console.error('useProfile - Session mismatch or expired');
          throw new Error('Authentication required');
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('useProfile - Profile fetch error:', error);
          
          // Handle specific RLS errors more gracefully
          if (error.message?.includes('infinite recursion')) {
            console.error('CRITICAL: RLS infinite recursion detected');
            throw new Error('Database configuration issue. Please contact support.');
          }
          
          if (error.message?.includes('permission denied') || error.code === '42501') {
            console.error('CRITICAL: RLS permission denied');
            throw new Error('Access denied. Please check your permissions.');
          }
          
          // Don't throw error if profile doesn't exist yet
          if (error.code === 'PGRST116') {
            console.log('useProfile - No profile found for user:', user.id, 'returning null');
            return null;
          }
          throw error;
        }
        
        console.log('useProfile - Profile fetch result for user:', user.id, 'Data:', data);
        
        // CRITICAL: Ensure we're only getting data for the current user
        if (data && data.id !== user.id) {
          console.error('CRITICAL: Profile data mismatch!', {
            requestedUserId: user.id,
            receivedUserId: data.id,
            requestedEmail: user.email,
            receivedEmail: data.email
          });
          throw new Error('Data integrity violation');
        }
        
        // Additional validation: ensure email matches
        if (data && data.email && data.email !== user.email) {
          console.error('CRITICAL: Profile email mismatch!', {
            userEmail: user.email,
            profileEmail: data.email
          });
          throw new Error('Email mismatch detected');
        }
        
        return data;
      } catch (error: any) {
        console.error('useProfile - Error in profile fetch:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 1, // Reduce cache time to 1 minute for better data freshness
    retry: (failureCount, error: any) => {
      // Don't retry if it's a "no rows" error
      if (error?.code === 'PGRST116') {
        return false;
      }
      // Don't retry authentication, data integrity, or RLS errors
      if (error?.message?.includes('Authentication required') || 
          error?.message?.includes('Data integrity violation') ||
          error?.message?.includes('Email mismatch') ||
          error?.message?.includes('infinite recursion') ||
          error?.message?.includes('permission denied')) {
        return false;
      }
      return failureCount < 1;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      if (!user?.id) throw new Error('No user ID');

      // Verify session before updating
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.id !== user.id) {
        throw new Error('Authentication required');
      }

      console.log('useProfile - Updating profile for user:', user.id, 'with data:', profileData);

      const updateData = { 
        id: user.id, 
        email: user.email, // Ensure email is consistent
        ...profileData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData)
        .select()
        .single();

      if (error) {
        console.error('useProfile - Profile update error:', error);
        
        // Handle specific RLS errors
        if (error.message?.includes('infinite recursion')) {
          throw new Error('Database configuration issue. Please contact support.');
        }
        
        if (error.message?.includes('permission denied')) {
          throw new Error('Access denied. Please check your permissions.');
        }
        
        throw error;
      }
      
      // Validate returned data matches current user
      if (data.id !== user.id) {
        console.error('CRITICAL: Updated profile ID mismatch!');
        throw new Error('Data integrity violation during update');
      }
      
      console.log('useProfile - Profile updated successfully for user:', user.id, 'Data:', data);
      return data;
    },
    onSuccess: (data) => {
      // Clear all cached data to prevent stale data issues
      queryClient.clear();
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      console.error('useProfile - Profile update error:', error);
      
      // Show user-friendly error messages
      if (error.message?.includes('Database configuration issue')) {
        toast.error('Database configuration issue. Please contact support.');
      } else if (error.message?.includes('Access denied')) {
        toast.error('Access denied. Please check your permissions.');
      } else {
        toast.error('Failed to update profile');
      }
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
