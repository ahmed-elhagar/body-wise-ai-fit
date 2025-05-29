
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
  completion_percentage: number;
  current_step: number;
  total_steps: number;
  basic_info_completed_at?: string;
  health_assessment_completed_at?: string;
  goals_setup_completed_at?: string;
  preferences_completed_at?: string;
  profile_review_completed_at?: string;
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading, refetch } = useQuery({
    queryKey: ['onboarding-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching onboarding progress:', error);
        throw error;
      }
      return data as OnboardingProgress | null;
    },
    enabled: !!user?.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<OnboardingProgress>) => {
      if (!user?.id) throw new Error('No user ID');

      console.log('useOnboardingProgress - Updating progress:', progressData);

      const { data: existing } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('onboarding_progress')
          .update({
            ...progressData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Progress update error:', error);
          throw error;
        }
        console.log('useOnboardingProgress - Updated progress:', data);
        return data;
      } else {
        const { data, error } = await supabase
          .from('onboarding_progress')
          .insert({
            user_id: user.id,
            basic_info_completed: false,
            health_assessment_completed: false,
            goals_setup_completed: false,
            preferences_completed: false,
            profile_review_completed: false,
            completion_percentage: 0,
            current_step: 1,
            total_steps: 4, // Only 4 steps now
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...progressData,
          })
          .select()
          .single();

        if (error) {
          console.error('Progress insert error:', error);
          throw error;
        }
        console.log('useOnboardingProgress - Created progress:', data);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      refetch();
    },
    onError: (error) => {
      console.error('Error updating onboarding progress:', error);
      toast.error('Failed to update progress');
    },
  });

  const markStepComplete = async (step: string) => {
    console.log('useOnboardingProgress - Marking step complete:', step);
    
    const stepData: any = {};
    stepData[`${step}_completed`] = true;
    stepData[`${step}_completed_at`] = new Date().toISOString();
    
    const currentProgress = progress || {
      basic_info_completed: false,
      health_assessment_completed: false,
      goals_setup_completed: false,
      preferences_completed: false,
    };
    
    const updatedProgress = { ...currentProgress, [`${step}_completed`]: true };
    
    const totalSteps = 4; // Only 4 steps now
    const completedSteps = [
      updatedProgress.basic_info_completed,
      updatedProgress.health_assessment_completed,
      updatedProgress.goals_setup_completed,
      updatedProgress.preferences_completed,
    ].filter(Boolean).length;
    
    stepData.completion_percentage = Math.round((completedSteps / totalSteps) * 100);
    stepData.current_step = Math.min(completedSteps + 1, totalSteps);
    stepData.total_steps = totalSteps;
    
    if (completedSteps === totalSteps) {
      stepData.completed_at = new Date().toISOString();
    }
    
    console.log('useOnboardingProgress - Step data to save:', stepData);
    
    try {
      const result = await updateProgressMutation.mutateAsync(stepData);
      console.log('useOnboardingProgress - Step completed successfully:', result);
      return result;
    } catch (error) {
      console.error('useOnboardingProgress - Failed to mark step complete:', error);
      throw error;
    }
  };

  return {
    progress,
    isLoading,
    updateProgress: updateProgressMutation.mutateAsync,
    markStepComplete,
    isUpdating: updateProgressMutation.isPending,
    refetch,
  };
};
