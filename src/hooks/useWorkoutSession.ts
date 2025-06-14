
import { useState, useCallback } from 'react';
import { useWorkoutTimer } from './useWorkoutTimer';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  rest_time?: number;
  completed?: boolean;
}

export interface WorkoutSession {
  id: string;
  name: string;
  exercises: Exercise[];
  started_at?: string;
  completed_at?: string;
  total_duration?: number;
}

export const useWorkoutSession = () => {
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const { timer, start, pause, resume, stop, reset } = useWorkoutTimer();

  const startSession = useCallback((session: WorkoutSession) => {
    setCurrentSession({
      ...session,
      started_at: new Date().toISOString(),
    });
    setCurrentExerciseIndex(0);
    setIsResting(false);
    start();
  }, [start]);

  const completeExercise = useCallback((exerciseIndex: number) => {
    if (!currentSession) return;

    const updatedExercises = [...currentSession.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      completed: true,
    };

    setCurrentSession({
      ...currentSession,
      exercises: updatedExercises,
    });

    // Move to next exercise or complete session
    if (exerciseIndex < currentSession.exercises.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
      setIsResting(true);
    } else {
      completeSession();
    }
  }, [currentSession]);

  const completeSession = useCallback(() => {
    if (!currentSession) return;

    setCurrentSession({
      ...currentSession,
      completed_at: new Date().toISOString(),
      total_duration: timer.hours * 3600 + timer.minutes * 60 + timer.seconds,
    });

    stop();
  }, [currentSession, timer, stop]);

  const pauseSession = useCallback(() => {
    pause();
  }, [pause]);

  const resumeSession = useCallback(() => {
    resume();
  }, [resume]);

  const endSession = useCallback(() => {
    setCurrentSession(null);
    setCurrentExerciseIndex(0);
    setIsResting(false);
    reset();
  }, [reset]);

  return {
    currentSession,
    currentExerciseIndex,
    isResting,
    timer,
    startSession,
    completeExercise,
    completeSession,
    pauseSession,
    resumeSession,
    endSession,
  };
};
