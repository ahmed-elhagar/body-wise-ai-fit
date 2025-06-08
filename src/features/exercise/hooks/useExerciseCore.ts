
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfWeek } from 'date-fns';
import type { ExerciseProgram } from '@/types/exercise';

export const useExerciseCore = (weekOffset: number = 0) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['exercise-program', user?.id, weekOffset],
    queryFn: async () => {
      if (!user?.id) {
        console.log('❌ useExerciseCore - No user ID');
        return null;
      }

      try {
        const weekStartDate = addDays(startOfWeek(new Date()), weekOffset * 7);
        const weekStartDateStr = format(weekStartDate, 'yyyy-MM-dd');

        console.log('🔍 Fetching exercise program for week:', weekStartDateStr);

        // Fetch weekly exercise program with related data
        const { data: weeklyProgram, error: programError } = await supabase
          .from('weekly_exercise_programs')
          .select(`
            *,
            daily_workouts:daily_workouts(
              *,
              exercises:exercises(*)
            )
          `)
          .eq('user_id', user.id)
          .eq('week_start_date', weekStartDateStr)
          .maybeSingle();

        if (programError) {
          console.error('❌ Error fetching exercise program:', programError);
          throw programError;
        }

        if (!weeklyProgram) {
          console.log('📋 No exercise program found for week:', weekStartDateStr);
          return null;
        }

        console.log('✅ Exercise program fetched:', {
          programId: weeklyProgram.id,
          workoutsCount: weeklyProgram.daily_workouts?.length || 0
        });

        return weeklyProgram as ExerciseProgram;
      } catch (error) {
        console.error('❌ Error in exercise core fetch:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error?.message?.includes('JWT') || error?.message?.includes('auth')) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true
  });
};
