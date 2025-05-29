
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useExerciseActions = (refetch: () => void) => {
  const { user } = useAuth();

  const completeExercise = async (exerciseId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('exercises')
      .update({ 
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId);

    if (error) {
      console.error('Error completing exercise:', error);
      throw error;
    }

    refetch();
  };

  const updateExerciseProgress = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('exercises')
      .update({ 
        actual_sets: sets,
        actual_reps: reps,
        notes: notes,
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId);

    if (error) {
      console.error('Error updating exercise progress:', error);
      throw error;
    }

    refetch();
  };

  return {
    completeExercise,
    updateExerciseProgress,
  };
};
