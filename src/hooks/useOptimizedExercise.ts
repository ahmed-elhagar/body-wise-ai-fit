
import { useMemo, useCallback } from 'react';
import { useExerciseProgramData } from '@/hooks/useExerciseProgramData';
import { useExerciseActions } from '@/hooks/useExerciseActions';
import { useDailyWorkouts } from '@/hooks/useDailyWorkouts';

export const useOptimizedExercise = () => {
  // Core exercise data
  const {
    weeklyProgram,
    isLoading: isProgramLoading,
    error: programError,
    refetch: refetchProgram,
  } = useExerciseProgramData();

  // Daily workouts data
  const {
    dailyWorkouts,
    selectedDay,
    setSelectedDay,
    currentWorkout,
    isLoading: isWorkoutsLoading,
  } = useDailyWorkouts();

  // Exercise actions
  const {
    completeExercise,
    updateExerciseProgress,
    generateNewProgram,
    exchangeExercise,
    isUpdating,
  } = useExerciseActions();

  // Memoized week structure
  const weekStructure = useMemo(() => {
    if (!weeklyProgram || !dailyWorkouts) return [];
    
    return Array.from({ length: 7 }, (_, index) => {
      const dayNumber = index + 1;
      const workout = dailyWorkouts.find(w => w.day_number === dayNumber);
      const isRestDay = !workout;
      const isCompleted = workout?.completed || false;
      
      return {
        dayNumber,
        dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
        workout,
        isRestDay,
        isCompleted,
        isToday: dayNumber === new Date().getDay() || (new Date().getDay() === 0 && dayNumber === 7),
      };
    });
  }, [weeklyProgram, dailyWorkouts]);

  // Progress calculations
  const progressMetrics = useMemo(() => {
    if (!dailyWorkouts) return { completedWorkouts: 0, totalWorkouts: 0, progressPercentage: 0 };
    
    const completedWorkouts = dailyWorkouts.filter(w => w.completed).length;
    const totalWorkouts = dailyWorkouts.length;
    const progressPercentage = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0;
    
    return {
      completedWorkouts,
      totalWorkouts,
      progressPercentage: Math.round(progressPercentage),
    };
  }, [dailyWorkouts]);

  // Current day exercises with progress
  const currentDayExercises = useMemo(() => {
    if (!currentWorkout) return [];
    
    return currentWorkout.exercises?.map(exercise => ({
      ...exercise,
      progressPercentage: exercise.completed ? 100 : 
        (exercise.actual_sets || 0) > 0 ? 
        ((exercise.actual_sets / exercise.sets) * 100) : 0,
    })) || [];
  }, [currentWorkout]);

  // Optimized exercise actions
  const optimizedActions = useMemo(() => ({
    completeWorkout: useCallback(async (workoutId: string) => {
      // Mark all exercises in workout as completed
      if (currentWorkout?.exercises) {
        await Promise.all(
          currentWorkout.exercises.map(exercise => 
            completeExercise(exercise.id, true)
          )
        );
      }
    }, [currentWorkout, completeExercise]),
    
    startWorkout: useCallback(async (workoutId: string) => {
      console.log('Starting workout:', workoutId);
      // Implementation for starting workout timer/session
    }, []),
    
    pauseWorkout: useCallback(async () => {
      console.log('Pausing workout');
      // Implementation for pausing workout
    }, []),
  }), [currentWorkout, completeExercise]);

  // Loading states
  const loadingStates = useMemo(() => ({
    isProgramLoading,
    isWorkoutsLoading,
    isUpdating,
    isGenerating: false, // Add when AI generation is being used
  }), [isProgramLoading, isWorkoutsLoading, isUpdating]);

  return {
    // Data
    weeklyProgram,
    dailyWorkouts,
    currentWorkout,
    weekStructure,
    currentDayExercises,
    
    // Navigation
    selectedDay,
    setSelectedDay,
    
    // Progress
    progressMetrics,
    
    // Actions
    completeExercise,
    updateExerciseProgress,
    generateNewProgram,
    exchangeExercise,
    optimizedActions,
    
    // Refetch
    refetchProgram,
    
    // Loading states
    loadingStates,
    programError,
  };
};
