
import { useExerciseProgramQuery } from './useExerciseProgramQuery';
import { useExerciseActions } from './useExerciseActions';
import { useCallback } from 'react';

export const useExerciseProgramData = (weekOffset: number = 0, workoutType: "home" | "gym" = "home") => {
  const { data: currentProgram, isLoading, error, refetch } = useExerciseProgramQuery(weekOffset, workoutType);
  const { completeExercise, updateExerciseProgress } = useExerciseActions(refetch);

  // Enhanced refetch with better error handling
  const enhancedRefetch = useCallback(async () => {
    try {
      console.log('🔄 Refetching exercise program data...', { weekOffset, workoutType });
      await refetch();
      console.log('✅ Exercise program data refetched successfully');
    } catch (error) {
      console.error('❌ Error refetching exercise program data:', error);
      throw error;
    }
  }, [refetch, weekOffset, workoutType]);

  // Enhanced complete exercise with optimistic updates
  const enhancedCompleteExercise = useCallback(async (exerciseId: string) => {
    try {
      console.log('✅ Completing exercise:', exerciseId);
      await completeExercise(exerciseId);
      console.log('✅ Exercise completed successfully');
    } catch (error) {
      console.error('❌ Error completing exercise:', error);
      throw error;
    }
  }, [completeExercise]);

  // Enhanced update exercise progress with validation
  const enhancedUpdateExerciseProgress = useCallback(async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string
  ) => {
    try {
      // Validate input
      if (!exerciseId || sets < 0 || !reps) {
        throw new Error('Invalid exercise progress data');
      }
      
      console.log('📊 Updating exercise progress:', { exerciseId, sets, reps, notes });
      await updateExerciseProgress(exerciseId, sets, reps, notes);
      console.log('✅ Exercise progress updated successfully');
    } catch (error) {
      console.error('❌ Error updating exercise progress:', error);
      throw error;
    }
  }, [updateExerciseProgress]);

  return {
    currentProgram,
    isLoading,
    error,
    refetch: enhancedRefetch,
    completeExercise: enhancedCompleteExercise,
    updateExerciseProgress: enhancedUpdateExerciseProgress,
  };
};

// Re-export types for backward compatibility
export type { ExerciseProgram, DailyWorkout, Exercise } from '@/types/exercise';
