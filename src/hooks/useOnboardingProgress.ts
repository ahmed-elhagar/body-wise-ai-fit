import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface OnboardingProgress {
  id: string;
  user_id: string;
  basic_info_completed: boolean;
  health_assessment_completed: boolean;
  goals_setup_completed: boolean;
  preferences_completed: boolean;
  profile_review_completed: boolean;
  current_step: number;
  completion_percentage: number;
  total_steps: number;
  basic_info_completed_at?: string;
  health_assessment_completed_at?: string;
  goals_setup_completed_at?: string;
  preferences_completed_at?: string;
  profile_review_completed_at?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading, error } = useQuery({
    queryKey: ['onboarding-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching onboarding progress:', error);
        throw error;
      }
      
      return data as OnboardingProgress | null;
    },
    enabled: !!user?.id,
  });

  const markStepCompleteMutation = useMutation({
    mutationFn: async (step: string) => {
      if (!user?.id) throw new Error('No user ID');

      const now = new Date().toISOString();
      const updateData: any = {
        user_id: user.id,
        updated_at: now,
        created_at: progress?.created_at || now, // Include created_at
      };

      switch (step) {
        case 'basic_info':
          updateData.basic_info_completed = true;
          updateData.basic_info_completed_at = now;
          break;
        case 'health_assessment':
          updateData.health_assessment_completed = true;
          updateData.health_assessment_completed_at = now;
          break;
        case 'goals_setup':
          updateData.goals_setup_completed = true;
          updateData.goals_setup_completed_at = now;
          break;
        case 'preferences':
          updateData.preferences_completed = true;
          updateData.preferences_completed_at = now;
          break;
        case 'profile_review':
          updateData.profile_review_completed = true;
          updateData.profile_review_completed_at = now;
          break;
      }

      // Calculate progress
      const completedSteps = [
        updateData.basic_info_completed || progress?.basic_info_completed,
        updateData.health_assessment_completed || progress?.health_assessment_completed,
        updateData.goals_setup_completed || progress?.goals_setup_completed,
        updateData.preferences_completed || progress?.preferences_completed,
        updateData.profile_review_completed || progress?.profile_review_completed,
      ].filter(Boolean).length;

      updateData.current_step = completedSteps;
      updateData.completion_percentage = (completedSteps / 5) * 100;
      updateData.total_steps = 5;

      if (completedSteps === 5) {
        updateData.completed_at = now;
      }

      const { data, error } = await supabase
        .from('onboarding_progress')
        .upsert(updateData)
        .select()
        .single();

      if (error) throw error;
      return data as OnboardingProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
    },
    onError: (error) => {
      console.error('Error marking step complete:', error);
      toast.error('Failed to update progress');
    },
  });

  return {
    progress,
    isLoading,
    error,
    markStepComplete: markStepCompleteMutation.mutate,
    isUpdating: markStepCompleteMutation.isPending,
  };
};
