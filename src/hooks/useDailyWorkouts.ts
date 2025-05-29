
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useDailyWorkouts = (weeklyProgramId?: string, dayNumber: number = 1, workoutType: "home" | "gym" = "home") => {
  const { user } = useAuth();

  const { data: workouts, isLoading: workoutsLoading, error: workoutsError } = useQuery({
    queryKey: ['daily-workouts', weeklyProgramId, dayNumber, workoutType],
    queryFn: async () => {
      if (!weeklyProgramId) return [];
      
      const { data, error } = await supabase
        .from('daily_workouts')
        .select('*')
        .eq('weekly_program_id', weeklyProgramId)
        .eq('day_number', dayNumber)
        .eq('type', workoutType)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!weeklyProgramId && !!user?.id,
  });

  const { data: exercises, isLoading: exercisesLoading, error: exercisesError } = useQuery({
    queryKey: ['exercises', workouts?.[0]?.id],
    queryFn: async () => {
      if (!workouts?.[0]?.id) return [];
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('daily_workout_id', workouts[0].id)
        .order('order_number', { ascending: true });

      if (error) throw error;
      return data?.map(exercise => ({
        ...exercise,
        completed: false // You can add a completed field to track progress
      }));
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
