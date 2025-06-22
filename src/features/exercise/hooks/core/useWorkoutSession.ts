import { useState, useCallback } from 'react';

export const useWorkoutSession = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const onExerciseComplete = useCallback(async (exerciseId: string) => {
    console.log('Exercise completed:', exerciseId);
  }, []);

  const onExerciseProgressUpdate = useCallback(async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    console.log('Exercise progress updated:', { exerciseId, sets, reps, notes, weight });
  }, []);

  const onStartWorkout = useCallback(() => {
    setIsTimerRunning(true);
  }, []);

  const onPauseWorkout = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  const onCompleteWorkout = useCallback(() => {
    setIsTimerRunning(false);
    setActiveExerciseId(null);
  }, []);

  return {
    activeExerciseId,
    workoutTimer,
    isTimerRunning,
    onExerciseComplete,
    onExerciseProgressUpdate,
    onStartWorkout,
    onPauseWorkout,
    onCompleteWorkout,
    setActiveExerciseId,
    setWorkoutTimer,
    setIsTimerRunning
  };
};