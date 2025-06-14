

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
      (sum: number, workout: any) => sum + (workout.exercises?.length || 0), 0
    );
    
    const completedWeeklyExercises = currentProgram.daily_workouts.reduce(
      (sum: number, workout: any) => sum + (workout.exercises?.filter((ex: any) => ex.completed).length || 0), 0
    );

    return { totalWeeklyExercises, completedWeeklyExercises };
  };

  // Create week structure for the container component with proper WeekDay interface
  const weekStructure = useMemo(() => {
    if (!currentProgram?.daily_workouts) return [];
    
    const today = new Date().getDay() || 7; // Convert Sunday (0) to 7
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
    return currentWorkout.exercises.map((ex: any, index: number) => ({
      ...ex,
      progressPercentage: ex.completed ? 100 : 0,
    }));
  }, [currentWorkout]);

  // Progress metrics with all required properties
  const progressMetrics = useMemo(() => {
    const stats = getWeeklyStats();
    const completedWorkouts = currentProgram?.daily_workouts?.filter((w: any) => w.completed).length || 0;
    const totalWorkouts = currentProgram?.daily_workouts?.length || 0;
    const weeklyProgress = stats.totalWeeklyExercises > 0 ? 
      Math.round((stats.completedWeeklyExercises / stats.totalWeeklyExercises) * 100) : 0;

    // Calculate current streak (mock for now - would need proper tracking)
    const currentStreak = completedWorkouts > 0 ? Math.min(completedWorkouts, 7) : 0;
    
    // Calculate estimated calories burned (mock calculation)
    const totalCaloriesBurned = stats.completedWeeklyExercises * 150; // 150 calories per exercise average
    
    // Determine average intensity based on completion rate
    const averageIntensity = weeklyProgress >= 80 ? 'High' : 
                           weeklyProgress >= 50 ? 'Medium' : 'Low';

    return {
      weeklyProgress,
      completedWorkouts,
      totalWorkouts,
      progressPercentage: weeklyProgress, // Add the missing progressPercentage property
      currentStreak,
      totalCaloriesBurned,
      averageIntensity,
    };
  }, [currentProgram]);

  // Loading states
  const loadingStates = {
    isProgramLoading: isLoading,
    isUpdating: false,
  };

  // Optimized actions
  const optimizedActions = {
    startWorkout: () => {
      console.log('Starting workout...');
    },
    completeWorkout: () => {
      console.log('Completing workout...');
    },
  };

  return {
    // Original properties
    currentProgram,
    todaysExercises,
    getExerciseStats,
    getWeeklyStats,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
    completeExercise,
    updateExerciseProgress,
    
    // New properties for OptimizedExerciseContainer
    weeklyProgram: currentProgram,
    weekStructure,
    currentWorkout,
    currentDayExercises,
    selectedDay,
    setSelectedDay,
    progressMetrics,
    loadingStates,
    programError: error,
    optimizedActions,
  };
};

