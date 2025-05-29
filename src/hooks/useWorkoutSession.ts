
import { useState, useCallback } from 'react';
import { useWorkoutTimer } from './useWorkoutTimer';

export const useWorkoutSession = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [exerciseStartTimes, setExerciseStartTimes] = useState<Record<string, number>>({});
  const [completedAt, setCompletedAt] = useState<Record<string, Date>>({});
  
  const timer = useWorkoutTimer();

  const startSession = useCallback(() => {
    setSessionStarted(true);
    timer.start();
  }, [timer]);

  const pauseSession = useCallback(() => {
    timer.pause();
  }, [timer]);

  const resumeSession = useCallback(() => {
    timer.resume();
  }, [timer]);

  const resetSession = useCallback(() => {
    setSessionStarted(false);
    setExerciseStartTimes({});
    setCompletedAt({});
    timer.reset();
  }, [timer]);

  const startExercise = useCallback((exerciseId: string) => {
    setExerciseStartTimes(prev => ({
      ...prev,
      [exerciseId]: timer.seconds
    }));
  }, [timer.seconds]);

  const completeExercise = useCallback((exerciseId: string) => {
    setCompletedAt(prev => ({
      ...prev,
      [exerciseId]: new Date()
    }));
  }, []);

  const getExerciseDuration = useCallback((exerciseId: string) => {
    const startTime = exerciseStartTimes[exerciseId];
    if (!startTime) return 0;
    
    const endTime = completedAt[exerciseId] ? 
      Math.floor((completedAt[exerciseId].getTime() - Date.now()) / 1000) + timer.seconds :
      timer.seconds;
    
    return Math.max(0, endTime - startTime);
  }, [exerciseStartTimes, completedAt, timer.seconds]);

  const shareProgress = useCallback(() => {
    const totalTime = timer.formatTime();
    const shareText = `💪 Just completed my workout in ${totalTime}! #FitnessJourney #WorkoutComplete`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Workout Complete!',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      // You could show a toast here
    }
  }, [timer]);

  return {
    sessionStarted,
    isActive: timer.isActive,
    isPaused: timer.isPaused,
    totalTime: timer.formatTime(),
    totalSeconds: timer.seconds,
    startSession,
    pauseSession,
    resumeSession,
    resetSession,
    startExercise,
    completeExercise,
    getExerciseDuration,
    shareProgress
  };
};
