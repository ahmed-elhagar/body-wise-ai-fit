
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  ExerciseProgram,
  DailyWorkout 
} from '@/types/exercise';
import { generateWeeklyWorkouts } from '@/utils/exerciseDataUtils';

export const useExerciseProgramQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['exercise-program', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('exercise_programs')
        .select(`
          *,
          daily_workouts (
            *,
            exercises (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as ExerciseProgram;
    },
    enabled: !!user?.id
  });
};
