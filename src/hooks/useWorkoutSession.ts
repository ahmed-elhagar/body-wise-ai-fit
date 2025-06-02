
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { Exercise } from '@/types/exercise';

export interface WorkoutSession {
  exerciseId: string;
  sets: Array<{
    reps: number;
    weight?: number;
    completed: boolean;
    restTime?: number;
  }>;
  startTime?: Date;
  endTime?: Date;
  notes?: string;
  completed: boolean;
}

export const useWorkoutSession = () => {
  const [sessions, setSessions] = useState<Map<string, WorkoutSession>>(new Map());
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);

  const startSession = useCallback((exercise: Exercise) => {
    const session: WorkoutSession = {
      exerciseId: exercise.id,
      sets: Array.from({ length: exercise.sets }, () => ({
        reps: 0,
        weight: 0,
        completed: false,
        restTime: 60
      })),
      startTime: new Date(),
      completed: false
    };
    
    setSessions(prev => new Map(prev).set(exercise.id, session));
    setCurrentExercise(exercise.id);
    
    toast.success('Workout session started!');
  }, []);

  const completeSet = useCallback((exerciseId: string, setIndex: number, reps: number, weight?: number) => {
    setSessions(prev => {
      const newSessions = new Map(prev);
      const session = newSessions.get(exerciseId);
      
      if (session && session.sets[setIndex]) {
        session.sets[setIndex] = {
          ...session.sets[setIndex],
          reps,
          weight,
          completed: true
        };
        newSessions.set(exerciseId, session);
        
        toast.success(`Set ${setIndex + 1} completed!`);
      }
      
      return newSessions;
    });
  }, []);

  const startRest = useCallback((duration: number = 60) => {
    setIsResting(true);
    setRestTimer(duration);
    
    toast.info(`Rest started: ${duration} seconds`);
    
    const interval = setInterval(() => {
      setRestTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResting(false);
          toast.success('Rest period complete!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const endSession = useCallback((exerciseId: string) => {
    setSessions(prev => {
      const newSessions = new Map(prev);
      const session = newSessions.get(exerciseId);
      
      if (session) {
        session.endTime = new Date();
        session.completed = true;
        newSessions.set(exerciseId, session);
        
        const completedSets = session.sets.filter(set => set.completed).length;
        toast.success(`Exercise completed! ${completedSets}/${session.sets.length} sets finished.`);
      }
      
      return newSessions;
    });
    
    if (currentExercise === exerciseId) {
      setCurrentExercise(null);
    }
  }, [currentExercise]);

  const pauseSession = useCallback((exerciseId: string) => {
    setCurrentExercise(null);
    toast.info('Session paused');
  }, []);

  const resumeSession = useCallback((exerciseId: string) => {
    setCurrentExercise(exerciseId);
    toast.info('Session resumed');
  }, []);

  const addNote = useCallback((exerciseId: string, note: string) => {
    setSessions(prev => {
      const newSessions = new Map(prev);
      const session = newSessions.get(exerciseId);
      
      if (session) {
        session.notes = note;
        newSessions.set(exerciseId, session);
      }
      
      return newSessions;
    });
  }, []);

  const getSessionProgress = useCallback((exerciseId: string) => {
    const session = sessions.get(exerciseId);
    if (!session) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = session.sets.filter(set => set.completed).length;
    const total = session.sets.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  }, [sessions]);

  return {
    sessions,
    currentExercise,
    isResting,
    restTimer,
    startSession,
    completeSet,
    startRest,
    endSession,
    pauseSession,
    resumeSession,
    addNote,
    getSessionProgress
  };
};
