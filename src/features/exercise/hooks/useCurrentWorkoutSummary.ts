
import { useMemo } from 'react';
import { useExerciseProgramData } from './useExerciseProgramData';
import { format, startOfWeek } from 'date-fns';
import { DailyWorkout, Exercise } from '@/features/exercise/types';

export const useCurrentWorkoutSummary = (workoutType: "home" | "gym" = "home") => {
  const currentDate = useMemo(() => new Date(), []);
  const weekStartDate = useMemo(() => startOfWeek(currentDate), [currentDate]);
  const weekStartDateString = format(weekStartDate, 'yyyy-MM-dd');
  const selectedDayNumber = currentDate.getDay() || 7; // Sunday is 0, so it becomes 7

  const { currentProgram, isLoading, error } = useExerciseProgramData(weekStartDateString, workoutType);

  const todaysWorkouts = useMemo(() => {
    if (!currentProgram?.daily_workouts) return [];
    return currentProgram.daily_workouts.filter(
      (workout: DailyWorkout) => workout.day_number === selectedDayNumber
    );
  }, [currentProgram, selectedDayNumber]);

  const todaysExercises = useMemo(() => {
    if (!todaysWorkouts.length) return [];
    return todaysWorkouts.flatMap((workout: DailyWorkout) => workout.exercises || []);
  }, [todaysWorkouts]);

  const { completedExercises, totalExercises, progressPercentage } = useMemo(() => {
    if (!todaysExercises || todaysExercises.length === 0) {
        return { completedExercises: 0, totalExercises: 0, progressPercentage: 0 };
    }
    const completed = todaysExercises.filter((ex: Exercise) => ex.completed).length;
    const total = todaysExercises.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      completedExercises: completed,
      totalExercises: total,
      progressPercentage: percentage
    };
  }, [todaysExercises]);

  return {
    currentProgram,
    isLoading,
    error,
    completedExercises,
    totalExercises,
    progressPercentage
  };
};

