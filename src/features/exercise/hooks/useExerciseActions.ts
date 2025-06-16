
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedErrorSystem } from '@/hooks/useEnhancedErrorSystem';
import { toast } from "@/hooks/use-toast";

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
      
      // Track performance via edge function
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

      toast({
        title: "Exercise Complete! 🏆",
        description: `Great job completing ${data.name}!`,
      });

      return data;
    } catch (error: any) {
      console.error('❌ Error completing exercise:', error);
      
      const errorContext = {
        operation: 'complete_exercise',
        retryable: true,
        severity: 'medium' as const,
        component: 'ExerciseActions'
      };

      if (error.message === 'USER_NOT_AUTHENTICATED') {
        handleError(new Error('Please sign in to complete exercises.'), errorContext);
      } else if (error.message === 'DATABASE_ERROR') {
        handleError(new Error('Failed to complete exercise. Please try again.'), errorContext);
      } else {
        handleError(error, errorContext);
      }
      
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

    console.log('📊 Updating exercise progress:', {
      exerciseId,
      sets,
      reps,
      notes,
      weight
    });

    try {
      const updateData: any = {
        actual_sets: sets,
        actual_reps: reps,
        updated_at: new Date().toISOString()
      };

      if (notes !== undefined) {
        updateData.notes = notes;
      }

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
      
      // Track performance via edge function
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

      return data;
    } catch (error: any) {
      console.error('❌ Error updating exercise progress:', error);
      
      const errorContext = {
        operation: 'update_exercise_progress',
        retryable: true,
        severity: 'low' as const,
        component: 'ExerciseActions'
      };

      if (error.message === 'USER_NOT_AUTHENTICATED') {
        handleError(new Error('Please sign in to update exercise progress.'), errorContext);
      } else if (error.message === 'DATABASE_ERROR') {
        handleError(new Error('Failed to update progress. Please try again.'), errorContext);
      } else {
        handleError(error, errorContext);
      }
      
      throw error;
    }
  };

  return {
    completeExercise,
    updateExerciseProgress
  };
};
