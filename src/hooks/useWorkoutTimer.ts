
import { useState, useEffect, useCallback } from 'react';

export interface WorkoutTimer {
  seconds: number;
  minutes: number;
  hours: number;
  isRunning: boolean;
  isPaused: boolean;
}

export const useWorkoutTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused]);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
    setIsPaused(false);
  }, []);

  const timer: WorkoutTimer = {
    seconds: seconds % 60,
    minutes: Math.floor(seconds / 60) % 60,
    hours: Math.floor(seconds / 3600),
    isRunning,
    isPaused,
  };

  return {
    timer,
    start,
    pause,
    resume,
    stop,
    reset,
    totalSeconds: seconds,
  };
};
