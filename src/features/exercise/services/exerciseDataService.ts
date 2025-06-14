
import { supabase } from '@/integrations/supabase/client';
import { 
  ExerciseProgram, 
  DailyWorkout,
  Exercise 
} from '@/types/exercise';

export const fetchUserExerciseProgram = async (userId: string): Promise<ExerciseProgram | null> => {
  const { data, error } = await supabase
    .from('exercise_programs')
    .select(`
      *,
      daily_workouts (
        *,
        exercises (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
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
  const { error } = await supabase
    .from('exercises')
    .update({
      actual_sets: progress.sets,
      actual_reps: progress.reps,
      weight: progress.weight,
      notes: progress.notes,
      completed: progress.completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', exerciseId);

  if (error) throw error;
};

export const createCustomExercise = async (
  dailyWorkoutId: string,
  exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>
) => {
  const { data, error } = await supabase
    .from('exercises')
    .insert({
      ...exercise,
      daily_workout_id: dailyWorkoutId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};
