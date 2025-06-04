
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useExerciseActions = (refetch: () => void) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const completeExercise = async (exerciseId: string) => {
    if (!user?.id) return;

    try {
      console.log('✅ Completing exercise:', exerciseId);
      
      const { error } = await supabase
        .from('exercises')
        .update({ 
          completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', exerciseId);

      if (error) {
        console.error('Error completing exercise:', error);
        throw error;
      }

      // Track performance analytics
      await supabase.functions.invoke('track-exercise-performance', {
        body: {
          exerciseId,
          userId: user.id,
          action: 'completed',
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Exercise Completed! 🎉",
        description: "Great job! Keep up the momentum.",
        duration: 3000,
      });

      refetch();
      console.log('✅ Exercise completed successfully');
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast({
        title: "Error",
        description: "Failed to complete exercise. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateExerciseProgress = async (exerciseId: string, sets: number, reps: string, notes?: string) => {
    if (!user?.id) return;

    try {
      // Validate input
      if (!exerciseId || sets < 0 || !reps) {
        throw new Error('Invalid exercise progress data');
      }
      
      console.log('📊 Updating exercise progress:', { exerciseId, sets, reps, notes });
      
      const { error } = await supabase
        .from('exercises')
        .update({ 
          actual_sets: sets,
          actual_reps: reps,
          notes: notes,
          completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', exerciseId);

      if (error) {
        console.error('Error updating exercise progress:', error);
        throw error;
      }

      // Track detailed performance analytics
      await supabase.functions.invoke('track-exercise-performance', {
        body: {
          exerciseId,
          userId: user.id,
          action: 'progress_updated',
          progressData: {
            sets_completed: sets,
            reps_completed: reps,
            notes
          },
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Progress Updated! 💪",
        description: `Logged ${sets} sets of ${reps} reps`,
        duration: 3000,
      });

      refetch();
      console.log('✅ Exercise progress updated successfully');
    } catch (error) {
      console.error('Error updating exercise progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getExerciseRecommendations = async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.functions.invoke('get-exercise-recommendations', {
        body: { userId: user.id }
      });

      if (error) {
        console.error('Error getting recommendations:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching exercise recommendations:', error);
      return null;
    }
  };

  return {
    completeExercise,
    updateExerciseProgress,
    getExerciseRecommendations,
  };
};
