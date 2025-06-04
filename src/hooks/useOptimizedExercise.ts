
import { useOptimizedExerciseProgramPage } from './useOptimizedExerciseProgramPage';
import { useExerciseActions } from './useExerciseActions';

export const useOptimizedExercise = () => {
  const {
    currentProgram,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
  } = useOptimizedExerciseProgramPage();

  const { completeExercise, updateExerciseProgress } = useExerciseActions();

  const getExerciseStats = () => {
    return {
      total: totalExercises,
      completed: completedExercises,
      remaining: totalExercises - completedExercises,
      completionRate: progressPercentage,
    };
  };

  const getWeeklyStats = () => {
    if (!currentProgram?.daily_workouts) {
      return { totalWeeklyExercises: 0, completedWeeklyExercises: 0 };
    }

    const totalWeeklyExercises = currentProgram.daily_workouts.reduce(
      (sum, workout) => sum + (workout.exercises?.length || 0), 0
    );
    
    const completedWeeklyExercises = currentProgram.daily_workouts.reduce(
      (sum, workout) => sum + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0
    );

    return { totalWeeklyExercises, completedWeeklyExercises };
  };

  return {
    currentProgram,
    todaysExercises,
    getExerciseStats,
    getWeeklyStats,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    completeExercise,
    updateExerciseProgress,
  };
};
