
import { useExerciseProgramData } from './useExerciseProgramData';
import { useExerciseProgramPage } from './useExerciseProgramPage';

export const useOptimizedExercise = () => {
  const { exercisePrograms, isLoading: dataLoading, error: dataError, refetch, invalidateQuery } = useExerciseProgramData();
  const exerciseProgramPage = useExerciseProgramPage();

  return {
    // From useExerciseProgramPage
    currentProgram: exerciseProgramPage.currentProgram,
    todaysWorkouts: exerciseProgramPage.todaysWorkouts,
    todaysExercises: exerciseProgramPage.todaysExercises,
    selectedDayNumber: exerciseProgramPage.selectedDayNumber,
    setSelectedDayNumber: exerciseProgramPage.setSelectedDayNumber,
    completedExercises: exerciseProgramPage.completedExercises,
    totalExercises: exerciseProgramPage.totalExercises,
    progressPercentage: exerciseProgramPage.progressPercentage,
    handleExerciseComplete: exerciseProgramPage.handleExerciseComplete,
    handleExerciseProgressUpdate: exerciseProgramPage.handleExerciseProgressUpdate,
    
    // From useExerciseProgramData
    exercisePrograms,
    isLoading: dataLoading || exerciseProgramPage.isLoading,
    error: dataError || exerciseProgramPage.error,
    refetch,
    invalidateQuery,
  };
};
