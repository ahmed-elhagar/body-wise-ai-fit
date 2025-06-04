
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useExerciseActions } from './useExerciseActions';
import { useEnhancedErrorSystem } from './useEnhancedErrorSystem';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useExerciseProgramData = (weekStartDate: string, workoutType: string) => {
  const { user } = useAuth();
  const { completeExercise, updateExerciseProgress } = useExerciseActions();
  const { handleError } = useEnhancedErrorSystem();
  const { language } = useLanguage();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['exercise-program', user?.id, weekStartDate, workoutType],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('USER_NOT_AUTHENTICATED');
      }

      console.log('🔍 Fetching exercise program:', {
        userId: user.id.substring(0, 8) + '...',
        weekStartDate,
        workoutType
      });

      try {
        const { data: program, error } = await supabase
          .from('weekly_exercise_programs')
          .select(`
            *,
            daily_workouts (
              *,
              exercises (*)
            )
          `)
          .eq('user_id', user.id)
          .eq('week_start_date', weekStartDate)
          .eq('workout_type', workoutType)
          .maybeSingle();

        if (error) {
          console.error('❌ Database error fetching program:', error);
          
          if (error.code === '57014') {
            throw new Error('TIMEOUT_ERROR');
          } else if (error.code === 'PGRST116') {
            throw new Error('PROGRAM_NOT_FOUND');
          } else {
            throw new Error('DATABASE_ERROR');
          }
        }

        if (!program) {
          console.log('ℹ️ No exercise program found for this week');
          return null;
        }

        console.log('✅ Program fetched successfully:', program.program_name);
        return program;

      } catch (error: any) {
        console.error('❌ Error in exercise program fetch:', error);
        
        // Handle specific error types with user-friendly messages
        const errorContext = {
          operation: 'fetch_exercise_program',
          userId: user.id,
          component: 'ExerciseProgramData',
          retryable: true,
          severity: 'high' as const
        };

        if (error.message === 'TIMEOUT_ERROR') {
          handleError(new Error('Request timed out. Please check your connection and try again.'), errorContext);
        } else if (error.message === 'USER_NOT_AUTHENTICATED') {
          handleError(new Error('Please sign in to access your exercise program.'), errorContext);
        } else if (error.message === 'DATABASE_ERROR') {
          handleError(new Error('Unable to load exercise program. Please try again.'), errorContext);
        } else {
          handleError(error, errorContext);
        }
        
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: (failureCount, error: any) => {
      // Don't retry authentication errors
      if (error?.message === 'USER_NOT_AUTHENTICATED') return false;
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleExerciseComplete = async (exerciseId: string) => {
    try {
      await completeExercise(exerciseId);
      
      // Invalidate and refetch the query
      await queryClient.invalidateQueries({
        queryKey: ['exercise-program', user?.id, weekStartDate, workoutType]
      });
      
    } catch (error: any) {
      console.error('❌ Error in handleExerciseComplete:', error);
      
      // Show user-friendly error message
      const errorMessage = language === 'ar'
        ? 'فشل في إكمال التمرين. يرجى المحاولة مرة أخرى.'
        : 'Failed to complete exercise. Please try again.';
      
      toast.error(errorMessage);
    }
  };

  const handleExerciseProgressUpdate = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    try {
      await updateExerciseProgress(exerciseId, sets, reps, notes, weight);
      
      // Invalidate and refetch the query
      await queryClient.invalidateQueries({
        queryKey: ['exercise-program', user?.id, weekStartDate, workoutType]
      });
      
    } catch (error: any) {
      console.error('❌ Error in handleExerciseProgressUpdate:', error);
      
      // Show user-friendly error message
      const errorMessage = language === 'ar'
        ? 'فشل في تحديث تقدم التمرين. يرجى المحاولة مرة أخرى.'
        : 'Failed to update exercise progress. Please try again.';
      
      toast.error(errorMessage);
    }
  };

  return {
    ...query,
    handleExerciseComplete,
    handleExerciseProgressUpdate
  };
};
