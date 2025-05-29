
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
  completion_percentage: number;
  current_step: number;
  total_steps: number;
  basic_info_completed_at?: string;
  health_assessment_completed_at?: string;
  goals_setup_completed_at?: string;
  preferences_completed_at?: string;
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface OnboardingProgressInput {
  basic_info_completed?: boolean;
  health_assessment_completed?: boolean;
  goals_setup_completed?: boolean;
  preferences_completed?: boolean;
  basic_info_completed_at?: string;
  health_assessment_completed_at?: string;
  goals_setup_completed_at?: string;
  preferences_completed_at?: string;
  completion_percentage?: number;
  current_step?: number;
  completed_at?: string;
}

const TOTAL_STEPS = 4;

const calculateProgress = (progressData: Partial<OnboardingProgress>): { percentage: number; currentStep: number; isComplete: boolean } => {
  const steps = [
    progressData.basic_info_completed,
    progressData.health_assessment_completed,
    progressData.goals_setup_completed,
    progressData.preferences_completed,
  ];
  
  const completedSteps = steps.filter(Boolean).length;
  const percentage = Math.round((completedSteps / TOTAL_STEPS) * 100);
  const currentStep = Math.min(completedSteps + 1, TOTAL_STEPS);
  const isComplete = completedSteps === TOTAL_STEPS;
  
  return { percentage, currentStep, isComplete };
};

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading, error, refetch } = useQuery({
    queryKey: ['onboarding-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('useOnboardingProgress - No user ID available');
        return null;
      }
      
      console.log('useOnboardingProgress - Fetching progress for user:', user.id);
      
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('useOnboardingProgress - Fetch error:', error);
        throw error;
      }
      
      console.log('useOnboardingProgress - Fetched progress:', data);
      return data as OnboardingProgress | null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: OnboardingProgressInput) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('useOnboardingProgress - Updating progress for user:', user.id);
      console.log('useOnboardingProgress - Progress data:', progressData);

      // Get current progress to merge with updates
      const currentProgress = progress || {
        basic_info_completed: false,
        health_assessment_completed: false,
        goals_setup_completed: false,
        preferences_completed: false,
      };

      // Merge current progress with new data
      const mergedData = { ...currentProgress, ...progressData };
      
      // Calculate progress metrics
      const { percentage, currentStep, isComplete } = calculateProgress(mergedData);

      // Prepare final data
      const finalData = {
        user_id: user.id,
        ...mergedData,
        completion_percentage: percentage,
        current_step: currentStep,
        total_steps: TOTAL_STEPS,
        updated_at: new Date().toISOString(),
        ...(isComplete && !mergedData.completed_at && { completed_at: new Date().toISOString() }),
        ...((!progress || !progress.started_at) && { started_at: new Date().toISOString() }),
      };

      console.log('useOnboardingProgress - Final progress data:', finalData);

      // Use upsert with the proper unique constraint
      const { data, error } = await supabase
        .from('onboarding_progress')
        .upsert(finalData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('useOnboardingProgress - Database error:', error);
        throw error;
      }

      console.log('useOnboardingProgress - Progress updated successfully:', data);
      return data as OnboardingProgress;
    },
    onSuccess: (data) => {
      console.log('useOnboardingProgress - Update successful');
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: Error) => {
      console.error('useOnboardingProgress - Update failed:', error);
      toast.error('Failed to update progress');
    },
  });

  const markStepComplete = async (step: string) => {
    console.log('useOnboardingProgress - Marking step complete:', step);
    
    const stepData: OnboardingProgressInput = {};
    const timestamp = new Date().toISOString();
    
    // Use proper type-safe assignment
    switch (step) {
      case 'basic_info':
        stepData.basic_info_completed = true;
        stepData.basic_info_completed_at = timestamp;
        break;
      case 'health_assessment':
        stepData.health_assessment_completed = true;
        stepData.health_assessment_completed_at = timestamp;
        break;
      case 'goals_setup':
        stepData.goals_setup_completed = true;
        stepData.goals_setup_completed_at = timestamp;
        break;
      case 'preferences':
        stepData.preferences_completed = true;
        stepData.preferences_completed_at = timestamp;
        break;
      default:
        console.warn('Unknown step:', step);
        return;
    }
    
    try {
      const result = await updateProgressMutation.mutateAsync(stepData);
      console.log('useOnboardingProgress - Step completed successfully:', step);
      return result;
    } catch (error) {
      console.error('useOnboardingProgress - Failed to mark step complete:', error);
      throw error;
    }
  };

  return {
    progress,
    isLoading,
    error,
    updateProgress: updateProgressMutation.mutateAsync,
    markStepComplete,
    isUpdating: updateProgressMutation.isPending,
    refetch,
  };
};
