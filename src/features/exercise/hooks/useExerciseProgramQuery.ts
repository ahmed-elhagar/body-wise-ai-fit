
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { addDays, startOfWeek, format } from 'date-fns';
import { ExerciseProgram } from '@/features/exercise';
import { generateWeeklyWorkouts } from '@/features/exercise/utils/exerciseDataUtils';

export const useExerciseProgramQuery = (weekOffset: number = 0, workoutType: "home" | "gym" = "home") => {
  const { user } = useAuth();
  const { language } = useI18n();

  // Calculate the target week start date based on offset
  const currentDate = new Date();
  const targetWeekStart = addDays(startOfWeek(currentDate), weekOffset * 7);
  const targetWeekStartString = format(targetWeekStart, 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['exercise-program', user?.id, weekOffset, workoutType, targetWeekStartString, language],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      console.log('🔍 Fetching exercise program:', {
        weekOffset,
        workoutType,
        targetWeekStart: targetWeekStartString,
        userId: user.id.substring(0, 8) + '...',
        userLanguage: language
      });

      // First try to get existing program for this specific week and workout type
      const { data: existingProgram, error: fetchError } = await supabase
        .from('weekly_exercise_programs')
        .select(`
          *,
          daily_workouts:daily_workouts(
            *,
            exercises:exercises(*)
          )
        `)
        .eq('user_id', user.id)
        .eq('workout_type', workoutType)
        .eq('week_start_date', targetWeekStartString)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('❌ Error fetching exercise program:', fetchError);
        throw fetchError;
      }

      // If no program found for this week, return null (empty state)
      if (!existingProgram) {
        console.log('📭 No program found for week:', targetWeekStartString, 'type:', workoutType);
        return null;
      }

      console.log('✅ Found program:', existingProgram.program_name, 'with', existingProgram.daily_workouts?.length || 0, 'workouts');

      // Transform data and handle rest days
      const transformedProgram = {
        ...existingProgram,
        workout_type: workoutType,
        current_week: existingProgram.current_week || 1,
        daily_workouts_count: existingProgram.daily_workouts?.length || 0,
        daily_workouts: generateWeeklyWorkouts(existingProgram.daily_workouts || [], workoutType)
      } as ExerciseProgram;

      console.log('✅ Transformed program with', transformedProgram.daily_workouts?.length, 'daily workouts (including rest days) for language:', language);

      return transformedProgram;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
};
