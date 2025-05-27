
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  height?: number;
  weight?: number;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  nationality?: string;
  body_shape?: 'ectomorph' | 'mesomorph' | 'endomorph';
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitness_goal?: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'maintenance' | 'endurance';
  allergies?: string[];
  health_conditions?: string[];
  preferred_foods?: string[];
  dietary_restrictions?: string[];
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
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
