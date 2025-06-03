
import { useMemo, useCallback, useState } from 'react';
import { useExerciseProgramData } from '@/hooks/useExerciseProgramData';
import { useExerciseActions } from '@/hooks/useExerciseActions';
import { useDailyWorkouts } from '@/hooks/useDailyWorkouts';

export const useOptimizedExercise = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  
  // Core exercise data
  const {
    currentProgram: weeklyProgram,
    isLoading: isProgramLoading,
    error: programError,
    refetch: refetchProgram,
  } = useExerciseProgramData();

  // Daily workouts data
  const {
    workouts: dailyWorkouts,
    exercises,
    isLoading: isWorkoutsLoading,
  } = useDailyWorkouts(weeklyProgram?.id, selectedDay);

  // Exercise actions
  const {
    completeExercise,
    updateExerciseProgress,
    getExerciseRecommendations,
  } = useExerciseActions();

  // Current workout for selected day
  const currentWorkout = useMemo(() => {
    return dailyWorkouts?.find(w => w.day_number === selectedDay) || null;
  }, [dailyWorkouts, selectedDay]);

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
    if (!exercises) return [];
    
    return exercises.map(exercise => ({
      ...exercise,
      progressPercentage: exercise.completed ? 100 : 0,
    }));
  }, [exercises]);

  // Optimized exercise actions
  const optimizedActions = useMemo(() => ({
    completeWorkout: useCallback(async () => {
      if (exercises) {
        await Promise.all(
          exercises.map(exercise => 
            completeExercise(exercise.id)
          )
        );
      }
    }, [exercises, completeExercise]),
    
    startWorkout: useCallback(async () => {
      console.log('Starting workout for day:', selectedDay);
    }, [selectedDay]),
    
    pauseWorkout: useCallback(async () => {
      console.log('Pausing workout');
    }, []),
  }), [exercises, completeExercise, selectedDay]);

  // Loading states
  const loadingStates = useMemo(() => ({
    isProgramLoading,
    isWorkoutsLoading,
    isUpdating: false,
    isGenerating: false,
  }), [isProgramLoading, isWorkoutsLoading]);

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
    getExerciseRecommendations,
    optimizedActions,
    
    // Refetch
    refetchProgram,
    
    // Loading states
    loadingStates,
    programError,
  };
};
