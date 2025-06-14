
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  ExerciseProgram,
  DailyWorkout 
} from '@/types/exercise';

export const useExerciseProgramQuery = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['exercise-program', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Since exercise_programs table doesn't exist, we'll create a mock program
      // In a real implementation, you would fetch from the appropriate table
      const mockProgram: ExerciseProgram = {
        id: 'default-program',
        name: 'Personal Fitness Program',
        description: 'Your personalized workout routine',
        duration_weeks: 12,
        daily_workouts: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return mockProgram;
    },
    enabled: !!user?.id
  });
};
