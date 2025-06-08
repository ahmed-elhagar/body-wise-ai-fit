
import { supabase } from '@/integrations/supabase/client';
import { Exercise, DailyWorkout, ExerciseProgram } from '../types';

export class ExerciseService {
  static async completeExercise(exerciseId: string, userId: string): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .update({ 
        completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async updateExerciseProgress(
    exerciseId: string,
    sets: number,
    reps: string,
    notes?: string,
    weight?: number
  ): Promise<Exercise> {
    const updateData: any = {
      actual_sets: sets,
      actual_reps: reps,
      updated_at: new Date().toISOString()
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data, error } = await supabase
      .from('exercises')
      .update(updateData)
      .eq('id', exerciseId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async getExerciseProgram(
    userId: string,
    weekStartDate: string,
    workoutType: "home" | "gym"
  ): Promise<ExerciseProgram | null> {
    const { data, error } = await supabase
      .from('weekly_exercise_programs')
      .select(`
        *,
        daily_workouts (
          *,
          exercises (*)
        )
      `)
      .eq('user_id', userId)
      .eq('week_start_date', weekStartDate)
      .eq('workout_type', workoutType)
      .maybeSingle();

    if (error) throw error;
    
    if (data) {
      return {
        ...data,
        workout_type: data.workout_type as "home" | "gym",
        daily_workouts_count: data.daily_workouts?.length || 0,
        daily_workouts: data.daily_workouts || []
      } as ExerciseProgram;
    }
    
    return data;
  }
}
