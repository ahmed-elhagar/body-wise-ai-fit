
import { useOptimizedExercise } from '@/hooks/useOptimizedExercise';
import { useExerciseProgramQuery } from '@/hooks/useExerciseProgramQuery';

export const useExerciseCore = (weekOffset: number = 0, workoutType: "home" | "gym" = "home") => {
  const optimizedExercise = useOptimizedExercise();
  const programQuery = useExerciseProgramQuery(weekOffset, workoutType);

  return {
    ...optimizedExercise,
    programQuery,
  };
};
