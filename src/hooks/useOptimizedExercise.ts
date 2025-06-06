
import { useExerciseProgramData } from './useExerciseProgramData';
import { useExerciseProgramPage } from './useExerciseProgramPage';

export const useOptimizedExercise = () => {
  const { exercisePrograms, isLoading: dataLoading, error: dataError, refetch, invalidateQuery } = useExerciseProgramData();
  const exerciseProgramPage = useExerciseProgramPage();

  return {
    // From useExerciseProgramPage - all properties
    currentProgram: exerciseProgramPage.currentProgram,
    todaysWorkouts: exerciseProgramPage.todaysWorkouts,
    todaysExercises: exerciseProgramPage.todaysExercises,
    selectedDayNumber: exerciseProgramPage.selectedDayNumber,
    setSelectedDayNumber: exerciseProgramPage.setSelectedDayNumber,
    currentWeekOffset: exerciseProgramPage.currentWeekOffset,
    setCurrentWeekOffset: exerciseProgramPage.setCurrentWeekOffset,
    workoutType: exerciseProgramPage.workoutType,
    setWorkoutType: exerciseProgramPage.setWorkoutType,
    showAIDialog: exerciseProgramPage.showAIDialog,
    setShowAIDialog: exerciseProgramPage.setShowAIDialog,
    aiPreferences: exerciseProgramPage.aiPreferences,
    setAiPreferences: exerciseProgramPage.setAiPreferences,
    completedExercises: exerciseProgramPage.completedExercises,
    totalExercises: exerciseProgramPage.totalExercises,
    progressPercentage: exerciseProgramPage.progressPercentage,
    isRestDay: exerciseProgramPage.isRestDay,
    currentDate: exerciseProgramPage.currentDate,
    weekStartDate: exerciseProgramPage.weekStartDate,
    handleExerciseComplete: exerciseProgramPage.handleExerciseComplete,
    handleExerciseProgressUpdate: exerciseProgramPage.handleExerciseProgressUpdate,
    
    // From useExerciseProgramData
    exercisePrograms,
    isLoading: dataLoading || exerciseProgramPage.isLoading,
    error: dataError || exerciseProgramPage.error,
    refetch: exerciseProgramPage.refetch,
    invalidateQuery,
  };
};
