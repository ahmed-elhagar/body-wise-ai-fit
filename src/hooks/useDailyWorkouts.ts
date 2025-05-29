
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DailyWorkout {
  id: string;
  weekly_program_id: string;
  day_number: number;
  workout_name: string;
  type: "home" | "gym";
  estimated_duration?: number;
  estimated_calories?: number;
  muscle_groups?: string[];
  created_at?: string;
}

interface Exercise {
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
  completed?: boolean;
}

export const useDailyWorkouts = (weeklyProgramId?: string, dayNumber: number = 1, workoutType: "home" | "gym" = "home") => {
  const { user } = useAuth();

  const { data: workouts, isLoading: workoutsLoading, error: workoutsError } = useQuery<DailyWorkout[]>({
    queryKey: ['daily-workouts', weeklyProgramId, dayNumber, workoutType],
    queryFn: async (): Promise<DailyWorkout[]> => {
      if (!weeklyProgramId) return [];
      
      const { data, error } = await supabase
        .from('daily_workouts')
        .select('*')
        .eq('weekly_program_id', weeklyProgramId)
        .eq('day_number', dayNumber)
        .eq('type', workoutType)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!weeklyProgramId && !!user?.id,
  });

  const { data: exercises, isLoading: exercisesLoading, error: exercisesError } = useQuery<Exercise[]>({
    queryKey: ['exercises', workouts?.[0]?.id],
    queryFn: async (): Promise<Exercise[]> => {
      if (!workouts?.[0]?.id) return [];
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('daily_workout_id', workouts[0].id)
        .order('order_number', { ascending: true });

      if (error) throw error;
      return data?.map(exercise => ({
        ...exercise,
        completed: false
      })) || [];
    },
    enabled: !!workouts?.[0]?.id,
  });

  return {
    workouts,
    exercises,
    isLoading: workoutsLoading || exercisesLoading,
    error: workoutsError || exercisesError,
  };
};
