
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';

export const useWorkoutSession = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const completeExercise = useMutation({
    mutationFn: async ({ exerciseId, completed }: { exerciseId: string; completed: boolean }) => {
      const { error } = await supabase
        .from('exercises')
        .update({ completed, updated_at: new Date().toISOString() })
        .eq('id', exerciseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Exercise updated!');
    },
    onError: (error) => {
      toast.error(`Failed to update exercise: ${error.message}`);
    }
  });

  const trackProgress = useMutation({
    mutationFn: async ({ 
      exerciseId, 
      sets, 
      reps, 
      weight, 
      notes 
    }: { 
      exerciseId: string; 
      sets: number; 
      reps: string; 
      weight?: number; 
      notes?: string; 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('track-exercise-performance', {
        body: {
          exerciseId,
          userId: user.id,
          action: 'progress_updated',
          progressData: {
            sets_completed: sets,
            reps_completed: reps,
            weight_used: weight,
            notes
          },
          timestamp: new Date().toISOString()
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-program'] });
      toast.success('Progress tracked!');
    },
    onError: (error) => {
      toast.error(`Failed to track progress: ${error.message}`);
    }
  });

  const onExerciseComplete = (exerciseId: string) => {
    completeExercise.mutate({ exerciseId, completed: true });
  };

  const onExerciseProgressUpdate = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    return trackProgress.mutateAsync({ exerciseId, sets, reps, weight, notes });
  };

  const onStartWorkout = () => {
    setIsTimerRunning(true);
  };

  const onPauseWorkout = () => {
    setIsTimerRunning(false);
  };

  const onCompleteWorkout = () => {
    setIsTimerRunning(false);
    setWorkoutTimer(0);
    toast.success('Workout completed!');
  };

  return {
    activeExerciseId,
    setActiveExerciseId,
    workoutTimer,
    setWorkoutTimer,
    isTimerRunning,
    setIsTimerRunning,
    onExerciseComplete,
    onExerciseProgressUpdate,
    onStartWorkout,
    onPauseWorkout,
    onCompleteWorkout
  };
};
