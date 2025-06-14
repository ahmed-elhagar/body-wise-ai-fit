
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserPreferences {
  theme_preference?: 'light' | 'dark' | 'auto';
  push_notifications?: boolean;
  email_notifications?: boolean;
  data_sharing_analytics?: boolean;
  measurement_units?: 'metric' | 'imperial';
  notifications?: boolean;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as UserPreferences;
    },
    enabled: !!user?.id
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: Partial<UserPreferences>) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...newPreferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', user?.id] });
      toast.success('Preferences updated successfully');
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  });

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    await updatePreferencesMutation.mutateAsync(newPreferences);
  };

  return {
    preferences: preferences || {},
    updatePreferences,
    isLoading,
    isUpdating: updatePreferencesMutation.isPending
  };
};
