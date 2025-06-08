
import { supabase } from '@/integrations/supabase/client';
import { Exercise, DailyWorkout, ExerciseProgram } from '@/types/exercise';

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
    workoutType: string
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
    
    // Add the missing daily_workouts_count property
    if (data) {
      return {
        ...data,
        daily_workouts_count: data.daily_workouts?.length || 0
      };
    }
    
    return data;
  }
}
