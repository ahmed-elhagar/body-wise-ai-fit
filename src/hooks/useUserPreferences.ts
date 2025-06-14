
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  marketing_emails: boolean;
  preferred_language: string;
  theme_preference: 'light' | 'dark' | 'auto';
  measurement_units: 'metric' | 'imperial';
  profile_visibility: 'private' | 'friends' | 'public';
  data_sharing_analytics: boolean;
  data_sharing_research: boolean;
  ai_suggestions: boolean;
  automatic_meal_planning: boolean;
  automatic_exercise_planning: boolean;
  progress_reminders: boolean;
  meal_reminder_times: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  workout_reminder_time: string;
  created_at: string;
  updated_at: string;
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
        .maybeSingle();

      if (error) throw error;
      return data as UserPreferences | null;
    },
    enabled: !!user?.id,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferencesData: Partial<UserPreferences>) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('user_preferences')
        .update({
          ...preferencesData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences'] });
      toast.success('Preferences updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
};
