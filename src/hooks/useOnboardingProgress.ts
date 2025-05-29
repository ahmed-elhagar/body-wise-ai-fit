
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

  const { data: progress, isLoading } = useQuery({
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
        return null;
      }
      return data as OnboardingProgress | null;
    },
    enabled: !!user?.id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: Partial<OnboardingProgress>) => {
      if (!user?.id) throw new Error('No user ID');

      console.log('useOnboardingProgress - Updating progress with data:', progressData);

      // First check if record exists
      const { data: existing } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { data, error } = await supabase
          .from('onboarding_progress')
          .update({
            ...progressData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        console.log('useOnboardingProgress - Updated existing progress:', data);
        return data;
      } else {
        // Create new record with defaults
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
            total_steps: 5,
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...progressData,
          })
          .select()
          .single();

        if (error) throw error;
        console.log('useOnboardingProgress - Created new progress:', data);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
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
    
    // Calculate completion percentage
    const totalSteps = 5;
    const currentCompletedSteps = progress ? [
      progress.basic_info_completed,
      progress.health_assessment_completed,
      progress.goals_setup_completed,
      progress.preferences_completed,
      progress.profile_review_completed
    ].filter(Boolean).length : 0;
    
    stepData.completion_percentage = Math.round(((currentCompletedSteps + 1) / totalSteps) * 100);
    stepData.current_step = Math.min(currentCompletedSteps + 2, totalSteps);
    
    console.log('useOnboardingProgress - Step data to save:', stepData);
    
    return updateProgressMutation.mutateAsync(stepData);
  };

  return {
    progress,
    isLoading,
    updateProgress: updateProgressMutation.mutate,
    markStepComplete,
    isUpdating: updateProgressMutation.isPending,
  };
};
