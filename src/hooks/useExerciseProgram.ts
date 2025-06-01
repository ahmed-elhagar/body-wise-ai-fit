
import { useState, useEffect } from 'react';

export interface ExerciseProgram {
  id: string;
  name: string;
  workout_type: 'home' | 'gym';
  difficulty_level: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
  order_number?: number;
}

export const useExerciseProgram = (workoutType: "home" | "gym", selectedDay: number, weekStartDate: Date) => {
  const [currentProgram, setCurrentProgram] = useState<ExerciseProgram | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateExerciseProgram = async (preferences: any) => {
    setIsGenerating(true);
    // Mock implementation
    setTimeout(() => {
      setCurrentProgram({
        id: '1',
        name: 'Sample Program',
        workout_type: workoutType,
        difficulty_level: 'beginner'
      });
      setIsGenerating(false);
    }, 2000);
  };

  const regenerateExerciseProgram = async () => {
    setIsGenerating(true);
    // Mock implementation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const updateExerciseCompletion = async (exerciseId: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
    ));
  };

  const updateExerciseProgress = (exerciseId: string, sets: number, reps: string, notes?: string) => {
    setExercises(prev => prev.map(ex => 
      ex.id === exerciseId ? { ...ex, sets, reps, completed: true } : ex
    ));
  };

  return {
    currentProgram,
    currentWorkout,
    exercises,
    isLoading,
    isGenerating,
    error,
    generateExerciseProgram,
    regenerateExerciseProgram,
    updateExerciseCompletion,
    updateExerciseProgress
  };
};
