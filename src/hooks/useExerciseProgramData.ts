
import { useExerciseProgramQuery } from './useExerciseProgramQuery';
import { useExerciseActions } from './useExerciseActions';

export const useExerciseProgramData = (weekOffset: number = 0, workoutType: "home" | "gym" = "home") => {
  const { data: currentProgram, isLoading, error, refetch } = useExerciseProgramQuery(weekOffset, workoutType);
  const { completeExercise, updateExerciseProgress } = useExerciseActions(refetch);

  return {
    currentProgram,
    isLoading,
    error,
    refetch,
    completeExercise,
    updateExerciseProgress,
  };
};

// Re-export types for backward compatibility
export type { ExerciseProgram, DailyWorkout, Exercise } from '@/types/exercise';
