
import { useState, useCallback } from 'react';
import { useWorkoutTimer } from './useWorkoutTimer';
import { toast } from "@/hooks/use-toast";

export const useWorkoutSession = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [exerciseStartTimes, setExerciseStartTimes] = useState<Record<string, number>>({});
  const [completedAt, setCompletedAt] = useState<Record<string, Date>>({});
  
  const timer = useWorkoutTimer();

  const startSession = useCallback(() => {
    setSessionStarted(true);
    timer.start();
    toast({
      title: "Workout Started! 💪",
      description: "Good luck with your workout session!",
    });
  }, [timer]);

  const pauseSession = useCallback(() => {
    if (timer.isActive && !timer.isPaused) {
      timer.pause();
      toast({
        title: "Workout Paused ⏸️",
        description: "Take a break and resume when ready.",
      });
    }
  }, [timer]);

  const resumeSession = useCallback(() => {
    if (timer.isActive && timer.isPaused) {
      timer.resume();
      toast({
        title: "Workout Resumed ▶️",
        description: "Let's continue with your workout!",
      });
    }
  }, [timer]);

  const resetSession = useCallback(() => {
    setSessionStarted(false);
    setExerciseStartTimes({});
    setCompletedAt({});
    timer.reset();
    toast({
      title: "Workout Reset 🔄",
      description: "Ready to start a fresh workout session.",
    });
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
    
    try {
      if (navigator.share && navigator.canShare) {
        navigator.share({
          title: 'Workout Complete!',
          text: shareText,
        }).catch(() => {
          navigator.clipboard.writeText(shareText).then(() => {
            toast({
              title: "Progress Copied! 📋",
              description: "Workout progress copied to clipboard.",
            });
          });
        });
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          toast({
            title: "Progress Copied! 📋",
            description: "Workout progress copied to clipboard.",
          });
        });
      }
    } catch (error) {
      console.log('Share not available, showing toast instead');
      toast({
        title: "Workout Complete! 🎉",
        description: `Great job! You completed your workout in ${totalTime}`,
      });
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
