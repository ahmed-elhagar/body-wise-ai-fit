import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedErrorSystem } from '@/hooks/useEnhancedErrorSystem';

export const useExerciseActions = () => {
  const { user } = useAuth();
  const { handleError } = useEnhancedErrorSystem();

  const completeExercise = async (exerciseId: string) => {
    if (!user?.id || !exerciseId) {
      throw new Error('USER_NOT_AUTHENTICATED');
    }

    console.log('✅ Completing exercise:', exerciseId);

    try {
      const { data, error } = await supabase
        .from('exercises')
        .update({ 
          completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', exerciseId)
        .select('*')
        .single();

      if (error) {
        console.error('❌ Database error completing exercise:', error);
        throw new Error('DATABASE_ERROR');
      }

      console.log('✅ Exercise completed successfully:', data.name);
      
      // Track performance
      if (typeof window !== 'undefined') {
        try {
          await fetch('/api/track-exercise-performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              exerciseId,
              userId: user.id,
              action: 'completed',
              timestamp: new Date().toISOString()
            })
          });
        } catch (trackingError) {
          console.warn('⚠️ Failed to track exercise completion:', trackingError);
        }
      }

      return data;
    } catch (error: any) {
      const errorContext = {
        operation: 'complete_exercise',
        retryable: true,
        severity: 'medium' as const,
        component: 'ExerciseActions'
      };

      handleError(error, errorContext);
      throw error;
    }
  };

  const updateExerciseProgress = async (
    exerciseId: string, 
    sets: number, 
    reps: string, 
    notes?: string, 
    weight?: number
  ) => {
    if (!user?.id || !exerciseId) {
      throw new Error('USER_NOT_AUTHENTICATED');
    }

    console.log('📊 Starting progress update:', {
      exerciseId,
      sets,
      reps,
      notes,
      weight
    });

    try {
      // Use the correct column names based on the database schema
      const updateData: any = {
        actual_sets: sets,
        actual_reps: reps,
        updated_at: new Date().toISOString()
      };

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      // Note: There's no weight column in the exercises table according to the schema
      // If weight tracking is needed, it should be added to the database schema first

      const { data, error } = await supabase
        .from('exercises')
        .update(updateData)
        .eq('id', exerciseId)
        .select('*')
        .single();

      if (error) {
        console.error('❌ Database error updating progress:', error);
        throw new Error('DATABASE_ERROR');
      }

      console.log('✅ Exercise progress updated successfully');
      
      // Track performance
      if (typeof window !== 'undefined') {
        try {
          await fetch('/api/track-exercise-performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              exerciseId,
              userId: user.id,
              action: 'progress_updated',
              progressData: { sets_completed: sets, reps_completed: reps },
              timestamp: new Date().toISOString()
            })
          });
        } catch (trackingError) {
          console.warn('⚠️ Failed to track exercise progress:', trackingError);
        }
      }

      return data;
    } catch (error: any) {
      const errorContext = {
        operation: 'update_exercise_progress',
        retryable: true,
        severity: 'low' as const,
        component: 'ExerciseActions'
      };

      handleError(error, errorContext);
      throw error;
    }
  };

  return {
    completeExercise,
    updateExerciseProgress
  };
};
