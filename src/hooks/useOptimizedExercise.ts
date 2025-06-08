
import { useOptimizedExerciseProgramPage } from './useOptimizedExerciseProgramPage';
import { useExerciseActions } from './useExerciseActions';
import { useMemo, useState } from 'react';

export const useOptimizedExercise = () => {
  const {
    currentProgram,
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    selectedDayNumber,
    setSelectedDayNumber,
    isLoading,
    error,
  } = useOptimizedExerciseProgramPage();

  const { completeExercise, updateExerciseProgress } = useExerciseActions();
  const [selectedDay, setSelectedDay] = useState(1);

  // Create week structure for the container component
  const weekStructure = useMemo(() => {
    if (!currentProgram?.daily_workouts) return [];
    
    const today = new Date().getDay() || 7;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return currentProgram.daily_workouts.map((workout: any) => ({
      dayNumber: workout.day_number,
      dayName: dayNames[workout.day_number - 1] || `Day ${workout.day_number}`,
      workout: workout,
      isRestDay: workout.is_rest_day || false,
      isCompleted: workout.completed || false,
      isToday: workout.day_number === today,
    }));
  }, [currentProgram]);

  // Get current workout for selected day
  const currentWorkout = useMemo(() => {
    if (!currentProgram?.daily_workouts) return null;
    return currentProgram.daily_workouts.find((w: any) => w.day_number === selectedDay) || null;
  }, [currentProgram, selectedDay]);

  // Get exercises for current day
  const currentDayExercises = useMemo(() => {
    if (!currentWorkout?.exercises) return [];
    return currentWorkout.exercises.map((ex: any) => ({
      ...ex,
      progressPercentage: ex.completed ? 100 : 0,
    }));
  }, [currentWorkout]);

  // Progress metrics
  const progressMetrics = useMemo(() => {
    const completedWorkouts = currentProgram?.daily_workouts?.filter((w: any) => w.completed).length || 0;
    const totalWorkouts = currentProgram?.daily_workouts?.length || 0;
    const totalWeeklyExercises = currentProgram?.daily_workouts?.reduce(
      (sum: number, workout: any) => sum + (workout.exercises?.length || 0), 0
    ) || 0;
    const completedWeeklyExercises = currentProgram?.daily_workouts?.reduce(
      (sum: number, workout: any) => sum + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0
    ) || 0;

    return {
      completedWorkouts,
      totalWorkouts,
      progressPercentage: totalWeeklyExercises > 0 ? 
        Math.round((completedWeeklyExercises / totalWeeklyExercises) * 100) : 0,
    };
  }, [currentProgram]);

  // Loading states
  const loadingStates = {
    isProgramLoading: isLoading,
    isUpdating: false,
  };

  return {
    // Core data
    currentProgram,
    weeklyProgram: currentProgram,
    weekStructure,
    currentWorkout,
    currentDayExercises,
    
    // State
    selectedDay,
    setSelectedDay,
    progressMetrics,
    loadingStates,
    programError: error,
    
    // Legacy support
    todaysExercises,
    completedExercises,
    totalExercises,
    progressPercentage,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    completeExercise,
    updateExerciseProgress,
    
    // Actions
    optimizedActions: {
      startWorkout: () => console.log('Starting workout...'),
      completeWorkout: () => console.log('Completing workout...'),
    },
  };
};
