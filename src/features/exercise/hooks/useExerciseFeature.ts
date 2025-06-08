
import { useOptimizedExerciseProgramPage } from './useOptimizedExerciseProgramPage';
import { useExerciseActions } from './useExerciseActions';
import { useMemo } from 'react';
import { calculateExerciseProgress } from '../utils/exerciseDataUtils';

export const useExerciseFeature = () => {
  const exerciseProgramPage = useOptimizedExerciseProgramPage();
  const exerciseActions = useExerciseActions();

  const exerciseStats = useMemo(() => {
    return calculateExerciseProgress(exerciseProgramPage.todaysExercises);
  }, [exerciseProgramPage.todaysExercises]);

  const weeklyStats = useMemo(() => {
    if (!exerciseProgramPage.currentProgram?.daily_workouts) {
      return { totalWeeklyExercises: 0, completedWeeklyExercises: 0 };
    }

    const totalWeeklyExercises = exerciseProgramPage.currentProgram.daily_workouts.reduce(
      (sum: number, workout: any) => sum + (workout.exercises?.length || 0), 0
    );
    
    const completedWeeklyExercises = exerciseProgramPage.currentProgram.daily_workouts.reduce(
      (sum: number, workout: any) => sum + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0
    );

    return { totalWeeklyExercises, completedWeeklyExercises };
  }, [exerciseProgramPage.currentProgram]);

  return {
    // Program page functionality
    ...exerciseProgramPage,
    
    // Exercise actions
    ...exerciseActions,
    
    // Calculated stats
    exerciseStats,
    weeklyStats,
  };
};
