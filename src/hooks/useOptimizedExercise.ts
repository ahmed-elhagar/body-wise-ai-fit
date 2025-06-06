
import { useExerciseProgramData } from './useExerciseProgramData';
import { useExerciseProgramPage } from './useExerciseProgramPage';

export const useOptimizedExercise = () => {
  const { exercisePrograms, isLoading, error, refetch, invalidateQuery } = useExerciseProgramData();
  const exerciseProgramPage = useExerciseProgramPage();

  return {
    ...exerciseProgramPage,
    exercisePrograms,
    isLoading: isLoading || exerciseProgramPage.isLoading,
    error: error || exerciseProgramPage.error,
    refetch,
    invalidateQuery,
  };
};
