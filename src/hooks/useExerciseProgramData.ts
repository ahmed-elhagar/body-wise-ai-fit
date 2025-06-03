
import { useExerciseProgramQuery } from './useExerciseProgramQuery';
import { useExerciseActions } from './useExerciseActions';
import { useCallback, useMemo } from 'react';

export const useExerciseProgramData = (weekOffset: number = 0, workoutType: "home" | "gym" = "home") => {
  console.log('📊 [useExerciseProgramData] Hook called with:', { weekOffset, workoutType });
  
  const { data: currentProgram, isLoading, error, refetch } = useExerciseProgramQuery(weekOffset, workoutType);
  const { completeExercise, updateExerciseProgress } = useExerciseActions(refetch);

  console.log('🔍 [useExerciseProgramData] Query results:', {
    hasProgram: !!currentProgram,
    isLoading,
    hasError: !!error,
    programId: currentProgram?.id
  });

  // Memoize the program data to prevent unnecessary re-renders
  const memoizedProgram = useMemo(() => {
    console.log('📝 [useExerciseProgramData] Memoizing program data:', !!currentProgram);
    return currentProgram;
  }, [currentProgram]);

  // Enhanced refetch with better error handling
  const enhancedRefetch = useCallback(async () => {
    try {
      console.log('🔄 [useExerciseProgramData] Refetching data...', { weekOffset, workoutType });
      await refetch();
      console.log('✅ [useExerciseProgramData] Data refetched successfully');
    } catch (error) {
      console.error('❌ [useExerciseProgramData] Error refetching data:', error);
      throw error;
    }
  }, [refetch, weekOffset, workoutType]);

  // Enhanced complete exercise with optimistic updates
  const enhancedCompleteExercise = useCallback(async (exerciseId: string) => {
    try {
      console.log('✅ [useExerciseProgramData] Completing exercise:', exerciseId);
      await completeExercise(exerciseId);
      console.log('✅ [useExerciseProgramData] Exercise completed successfully');
    } catch (error) {
      console.error('❌ [useExerciseProgramData] Error completing exercise:', error);
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
        console.error('❌ [useExerciseProgramData] Invalid exercise progress data:', {
          exerciseId,
          sets,
          reps
        });
        throw new Error('Invalid exercise progress data');
      }
      
      console.log('📊 [useExerciseProgramData] Updating exercise progress:', { exerciseId, sets, reps, notes });
      await updateExerciseProgress(exerciseId, sets, reps, notes);
      console.log('✅ [useExerciseProgramData] Exercise progress updated successfully');
    } catch (error) {
      console.error('❌ [useExerciseProgramData] Error updating exercise progress:', error);
      throw error;
    }
  }, [updateExerciseProgress]);

  console.log('🎯 [useExerciseProgramData] Hook returning data');

  return {
    currentProgram: memoizedProgram,
    isLoading,
    error,
    refetch: enhancedRefetch,
    completeExercise: enhancedCompleteExercise,
    updateExerciseProgress: enhancedUpdateExerciseProgress,
  };
};

// Re-export types for backward compatibility
export type { ExerciseProgram, DailyWorkout, Exercise } from '@/types/exercise';
