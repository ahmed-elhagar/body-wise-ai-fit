
import { useState, useEffect } from 'react';
import { useExerciseProgramData } from './useExerciseProgramData';
import { useAuth } from './useAuth';

export const useExerciseProgramPage = () => {
  const { user } = useAuth();
  const { exercisePrograms, isLoading, error } = useExerciseProgramData();
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  // Get current program (latest one)
  const currentProgram = exercisePrograms?.[0] || null;

  // Get today's workouts and exercises
  const todaysWorkouts = currentProgram?.daily_workouts?.filter(
    (workout: any) => workout.day_number === selectedDayNumber
  ) || [];

  const todaysExercises = todaysWorkouts.flatMap(
    (workout: any) => workout.exercises || []
  );

  // Calculate progress
  const completedExercises = todaysExercises.filter(
    (exercise: any) => exercise.completed
  ).length;
  const totalExercises = todaysExercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  // Exercise completion handlers
  const handleExerciseComplete = (exerciseId: string, completed: boolean) => {
    console.log('Exercise completion:', { exerciseId, completed });
    // TODO: Implement exercise completion logic
  };

  const handleExerciseProgressUpdate = (exerciseId: string, progress: any) => {
    console.log('Exercise progress update:', { exerciseId, progress });
    // TODO: Implement progress update logic
  };

  return {
    currentProgram,
    todaysWorkouts,
    todaysExercises,
    selectedDayNumber,
    setSelectedDayNumber,
    completedExercises,
    totalExercises,
    progressPercentage,
    isLoading,
    error,
    handleExerciseComplete,
    handleExerciseProgressUpdate,
  };
};
