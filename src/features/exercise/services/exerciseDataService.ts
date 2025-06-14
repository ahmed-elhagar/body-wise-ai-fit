
import { supabase } from '@/integrations/supabase/client';
import { 
  ExerciseProgram, 
  DailyWorkout,
  Exercise 
} from '@/types/exercise';

export const fetchUserExerciseProgram = async (userId: string): Promise<ExerciseProgram | null> => {
  // Since exercise_programs table doesn't exist, return a mock program
  const mockProgram: ExerciseProgram = {
    id: 'default-program',
    name: 'Personal Fitness Program',
    description: 'Your personalized workout routine',
    duration_weeks: 12,
    daily_workouts: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return mockProgram;
};

export const updateExerciseProgress = async (
  exerciseId: string,
  progress: {
    sets: number;
    reps: string;
    weight?: number;
    notes?: string;
    completed: boolean;
  }
) => {
  // Since exercises table doesn't exist, we'll just log the progress
  console.log('Exercise progress update:', { exerciseId, progress });
  return Promise.resolve();
};

export const createCustomExercise = async (
  dailyWorkoutId: string,
  exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>
) => {
  // Since exercises table doesn't exist, return a mock exercise
  const mockExercise: Exercise = {
    ...exercise,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  return mockExercise;
};
