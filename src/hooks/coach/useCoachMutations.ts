
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../useAuth';
import { toast } from 'sonner';

export const useCoachMutations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Assign trainee mutation
  const assignTrainee = useMutation({
    mutationFn: async ({ traineeId, notes }: { traineeId: string; notes?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_trainees')
        .insert({
          coach_id: user.id,
          trainee_id: traineeId,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
      toast.success('Trainee assigned successfully');
    },
    onError: (error: Error) => {
      console.error('Error assigning trainee:', error);
      toast.error(`Failed to assign trainee: ${error.message}`);
    },
  });

  // Remove trainee mutation
  const removeTrainee = useMutation({
    mutationFn: async (traineeId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('coach_trainees')
        .delete()
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
      toast.success('Trainee removed successfully');
    },
    onError: (error: Error) => {
      console.error('Error removing trainee:', error);
      toast.error(`Failed to remove trainee: ${error.message}`);
    },
  });

  // Update trainee notes mutation
  const updateTraineeNotes = useMutation({
    mutationFn: async ({ traineeId, notes }: { traineeId: string; notes: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_trainees')
        .update({ notes })
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees', user?.id] });
      toast.success('Notes updated successfully');
    },
    onError: (error: Error) => {
      console.error('Error updating notes:', error);
      toast.error(`Failed to update notes: ${error.message}`);
    },
  });

  return {
    assignTrainee: assignTrainee.mutate,
    removeTrainee: removeTrainee.mutate,
    updateTraineeNotes: updateTraineeNotes.mutate,
    isAssigning: assignTrainee.isPending,
    isRemoving: removeTrainee.isPending,
    isUpdatingNotes: updateTraineeNotes.isPending,
  };
};
