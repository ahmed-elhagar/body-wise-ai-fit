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
    
    // Transform database result to our Exercise type
    return {
      id: data.id,
      daily_workout_id: data.daily_workout_id,
      name: data.name,
      muscle_groups: data.muscle_groups || [],
      equipment: data.equipment,
      difficulty_level: (data.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
      instructions: data.instructions || '',
      youtube_search_term: data.youtube_search_term,
      sets: data.sets,
      reps: data.reps,
      rest_seconds: data.rest_seconds,
      order_number: data.order_number || 1,
      completed: data.completed || false,
      notes: data.notes,
      actual_sets: data.actual_sets,
      actual_reps: data.actual_reps,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
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
    
    // Transform database result to our Exercise type
    return {
      id: data.id,
      daily_workout_id: data.daily_workout_id,
      name: data.name,
      muscle_groups: data.muscle_groups || [],
      equipment: data.equipment,
      difficulty_level: (data.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
      instructions: data.instructions || '',
      youtube_search_term: data.youtube_search_term,
      sets: data.sets,
      reps: data.reps,
      rest_seconds: data.rest_seconds,
      order_number: data.order_number || 1,
      completed: data.completed || false,
      notes: data.notes,
      actual_sets: data.actual_sets,
      actual_reps: data.actual_reps,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
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
      // Transform daily workouts to match our type
      const transformedDailyWorkouts: DailyWorkout[] = (data.daily_workouts || []).map((workout: any) => ({
        id: workout.id,
        weekly_program_id: workout.weekly_program_id,
        day_number: workout.day_number,
        workout_name: workout.workout_name,
        target_muscle_groups: workout.muscle_groups || [],
        estimated_duration: workout.estimated_duration || 45,
        estimated_calories: workout.estimated_calories,
        difficulty_level: 'beginner' as const,
        completed: workout.completed || false,
        exercises: (workout.exercises || []).map((exercise: any) => ({
          id: exercise.id,
          exercise_id: exercise.id,
          exercise: {
            id: exercise.id,
            daily_workout_id: exercise.daily_workout_id,
            name: exercise.name,
            muscle_groups: exercise.muscle_groups || [],
            equipment: exercise.equipment,
            difficulty_level: (exercise.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
            instructions: exercise.instructions || '',
            youtube_search_term: exercise.youtube_search_term,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_seconds: exercise.rest_seconds,
            order_number: exercise.order_number || 1,
            completed: exercise.completed || false,
            notes: exercise.notes,
            actual_sets: exercise.actual_sets,
            actual_reps: exercise.actual_reps,
            created_at: exercise.created_at,
            updated_at: exercise.updated_at
          },
          sets: exercise.sets || 3,
          reps_min: 8,
          reps_max: 12,
          rest_seconds: exercise.rest_seconds || 60,
          order_index: exercise.order_number || 1
        })),
        created_at: workout.created_at,
        updated_at: workout.updated_at
      }));

      return {
        id: data.id,
        program_name: data.program_name,
        difficulty_level: data.difficulty_level,
        workout_type: data.workout_type as "home" | "gym",
        current_week: data.current_week,
        week_start_date: data.week_start_date,
        created_at: data.created_at,
        daily_workouts_count: transformedDailyWorkouts.length,
        total_estimated_calories: data.total_estimated_calories,
        generation_prompt: data.generation_prompt,
        daily_workouts: transformedDailyWorkouts
      };
    }
    
    return null;
  }
}
