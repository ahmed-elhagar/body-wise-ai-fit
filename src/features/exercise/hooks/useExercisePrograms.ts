
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import type { ExerciseFetchResult, WeeklyExerciseProgram, DailyWorkout, Exercise } from '../types';

export const useExercisePrograms = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const getWeekStartDate = (offset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const daysToSaturday = currentDay === 6 ? 0 : 6 - currentDay;
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysToSaturday + (offset * 7));
    return saturday.toISOString().split('T')[0];
  };

  return useQuery({
    queryKey: ['exercise-programs', user?.id, weekOffset],
    queryFn: async (): Promise<ExerciseFetchResult> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const weekStartDate = getWeekStartDate(weekOffset);

      // Fetch weekly program
      const { data: weeklyProgramData, error: programError } = await supabase
        .from('weekly_exercise_programs')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      if (programError) {
        console.error('Error fetching weekly program:', programError);
        throw programError;
      }

      if (!weeklyProgramData) {
        return {
          weeklyProgram: null,
          dailyWorkouts: []
        };
      }

      // Transform the data to match our types with proper type casting
      const weeklyProgram: WeeklyExerciseProgram = {
        id: weeklyProgramData.id,
        user_id: weeklyProgramData.user_id,
        week_start_date: weeklyProgramData.week_start_date,
        program_name: weeklyProgramData.program_name,
        program_type: 'mixed',
        total_workouts: 7,
        estimated_weekly_hours: 5,
        difficulty_level: (weeklyProgramData.difficulty_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        target_muscle_groups: ['full_body'],
        workout_type: (weeklyProgramData.workout_type as 'home' | 'gym') || 'home',
        current_week: weeklyProgramData.current_week || 1,
        status: weeklyProgramData.status || 'active',
        daily_workouts: [],
        created_at: weeklyProgramData.created_at,
        updated_at: weeklyProgramData.updated_at
      };

      // Fetch daily workouts with exercises
      const { data: dailyWorkoutsData, error: workoutsError } = await supabase
        .from('daily_workouts')
        .select(`
          *,
          exercises:exercises(*)
        `)
        .eq('weekly_program_id', weeklyProgram.id)
        .order('day_number');

      if (workoutsError) {
        console.error('Error fetching daily workouts:', workoutsError);
        throw workoutsError;
      }

      // Transform daily workouts data with proper Exercise type
      const dailyWorkouts: DailyWorkout[] = (dailyWorkoutsData || []).map(workout => ({
        id: workout.id,
        weekly_program_id: workout.weekly_program_id,
        day_number: workout.day_number,
        workout_name: workout.workout_name,
        target_muscle_groups: workout.muscle_groups || [],
        estimated_duration: workout.estimated_duration || 45,
        estimated_calories: workout.estimated_calories,
        difficulty_level: 'beginner' as const,
        completed: workout.completed || false,
        exercises: (workout.exercises || []).map((exercise: any): Exercise => ({
          id: exercise.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          actual_sets: exercise.actual_sets,
          actual_reps: exercise.actual_reps,
          completed: exercise.completed || false,
          instructions: exercise.instructions || '',
          muscle_groups: exercise.muscle_groups || [],
          equipment: exercise.equipment,
          difficulty: exercise.difficulty,
          difficulty_level: exercise.difficulty,
          youtube_search_term: exercise.youtube_search_term,
          notes: exercise.notes,
          rest_seconds: exercise.rest_seconds,
          order_number: exercise.order_number || 1,
          daily_workout_id: exercise.daily_workout_id,
          created_at: exercise.created_at,
          updated_at: exercise.updated_at
        })),
        // Check if this workout is a rest day based on workout name or lack of exercises
        is_rest_day: workout.workout_name?.toLowerCase().includes('rest') || 
                     workout.workout_name?.toLowerCase().includes('recovery') || 
                     (workout.exercises?.length === 0),
        created_at: workout.created_at,
        updated_at: workout.updated_at
      }));

      weeklyProgram.daily_workouts = dailyWorkouts;

      return {
        weeklyProgram,
        dailyWorkouts
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
};
