
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import type { ExerciseFetchResult } from '../types';

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
      const { data: weeklyProgram, error: programError } = await supabase
        .from('weekly_exercise_programs')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      if (programError) {
        console.error('Error fetching weekly program:', programError);
        throw programError;
      }

      if (!weeklyProgram) {
        return {
          weeklyProgram: null,
          dailyWorkouts: []
        };
      }

      // Fetch daily workouts with exercises
      const { data: dailyWorkouts, error: workoutsError } = await supabase
        .from('daily_workouts')
        .select(`
          *,
          exercises:workout_exercises(
            *,
            exercise:exercises(*)
          )
        `)
        .eq('weekly_program_id', weeklyProgram.id)
        .order('day_number');

      if (workoutsError) {
        console.error('Error fetching daily workouts:', workoutsError);
        throw workoutsError;
      }

      return {
        weeklyProgram,
        dailyWorkouts: dailyWorkouts || []
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
