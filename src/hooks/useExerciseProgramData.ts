
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ExerciseProgram {
  id: string;
  program_name: string;
  difficulty_level: string;
  workout_type: "home" | "gym";
  current_week: number;
  week_start_date: string;
  created_at: string;
  daily_workouts_count: number;
  total_estimated_calories?: number;
  generation_prompt?: any;
  daily_workouts?: DailyWorkout[];
}

export interface DailyWorkout {
  id: string;
  weekly_program_id: string;
  day_number: number;
  workout_name: string;
  estimated_duration?: number;
  estimated_calories?: number;
  muscle_groups?: string[];
  completed: boolean;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  daily_workout_id: string;
  name: string;
  sets?: number;
  reps?: string;
  rest_seconds?: number;
  muscle_groups?: string[];
  instructions?: string;
  youtube_search_term?: string;
  equipment?: string;
  difficulty?: string;
  order_number?: number;
  completed: boolean;
  notes?: string;
  actual_sets?: number;
  actual_reps?: string;
}

export const useExerciseProgramData = (weekOffset: number = 0) => {
  const { user } = useAuth();

  const { data: currentProgram, isLoading: isProgramLoading, error: programError, refetch } = useQuery({
    queryKey: ['current-exercise-program', user?.id, weekOffset],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts:daily_workouts(
            *,
            exercises:exercises(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Transform data to match interface
      if (data) {
        return {
          ...data,
          current_week: 1,
          daily_workouts_count: data.daily_workouts?.length || 0
        } as ExerciseProgram;
      }
      
      return null;
    },
    enabled: !!user?.id,
  });

  return {
    currentProgram,
    isLoading: isProgramLoading,
    error: programError,
    refetch,
  };
};
