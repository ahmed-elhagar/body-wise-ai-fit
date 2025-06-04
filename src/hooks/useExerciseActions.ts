
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedErrorSystem } from './useEnhancedErrorSystem';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useExerciseActions = () => {
  const { handleError, withErrorBoundary } = useEnhancedErrorSystem();
  const { language } = useLanguage();

  const completeExercise = withErrorBoundary(
    async (exerciseId: string) => {
      console.log('✅ Starting exercise completion:', exerciseId);
      
      const { data, error } = await supabase
        .from('exercises')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', exerciseId)
        .select()
        .single();

      if (error) {
        console.error('❌ Database error completing exercise:', error);
        
        // Handle specific error types
        if (error.code === '57014') {
          throw new Error('TIMEOUT_ERROR');
        } else if (error.code === '23503') {
          throw new Error('EXERCISE_NOT_FOUND');
        } else {
          throw new Error('DATABASE_ERROR');
        }
      }

      console.log('✅ Exercise completed successfully:', data);
      
      // Show success message
      toast.success(
        language === 'ar' 
          ? 'تم إكمال التمرين بنجاح!' 
          : 'Exercise completed successfully!'
      );
      
      return data;
    },
    {
      operation: 'complete_exercise',
      retryable: true,
      severity: 'medium',
      component: 'ExerciseActions'
    }
  );

  const updateExerciseProgress = withErrorBoundary(
    async (
      exerciseId: string, 
      sets: number, 
      reps: string, 
      notes?: string, 
      weight?: number
    ) => {
      console.log('📊 Starting progress update:', { exerciseId, sets, reps, notes, weight });
      
      const updateData: any = {
        sets_completed: sets,
        reps_completed: reps,
        updated_at: new Date().toISOString()
      };

      if (notes) updateData.notes = notes;
      if (weight !== undefined) updateData.weight_used = weight;

      const { data, error } = await supabase
        .from('exercises')
        .update(updateData)
        .eq('id', exerciseId)
        .select()
        .single();

      if (error) {
        console.error('❌ Database error updating progress:', error);
        
        if (error.code === '57014') {
          throw new Error('TIMEOUT_ERROR');
        } else if (error.code === '23503') {
          throw new Error('EXERCISE_NOT_FOUND');
        } else {
          throw new Error('DATABASE_ERROR');
        }
      }

      console.log('✅ Progress updated successfully:', data);
      return data;
    },
    {
      operation: 'update_exercise_progress',
      retryable: true,
      severity: 'low',
      component: 'ExerciseActions'
    }
  );

  return {
    completeExercise,
    updateExerciseProgress
  };
};
