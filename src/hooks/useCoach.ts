
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Trainee {
  id: string;
  coach_id: string;
  trainee_id: string;
  assigned_at: string;
  notes: string;
  trainee_profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const useCoach = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: trainees, isLoading } = useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          *,
          profiles!coach_trainees_trainee_id_fkey(first_name, last_name, email)
        `)
        .eq('coach_id', user.id);

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        trainee_profile: item.profiles || { first_name: '', last_name: '', email: '' }
      })) as Trainee[];
    },
    enabled: !!user?.id,
  });

  const assignTrainee = useMutation({
    mutationFn: async ({ traineeEmail, notes }: { traineeEmail: string; notes?: string }) => {
      // First find the trainee by email
      const { data: traineeProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', traineeEmail)
        .single();

      if (profileError) throw new Error('Trainee not found');

      const { data, error } = await supabase
        .from('coach_trainees')
        .insert({
          coach_id: user?.id,
          trainee_id: traineeProfile.id,
          notes: notes || ''
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees'] });
      toast.success('Trainee assigned successfully');
    },
    onError: (error) => {
      toast.error(`Failed to assign trainee: ${error.message}`);
    }
  });

  const removeTrainee = useMutation({
    mutationFn: async (traineeId: string) => {
      const { error } = await supabase
        .from('coach_trainees')
        .delete()
        .eq('coach_id', user?.id)
        .eq('trainee_id', traineeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees'] });
      toast.success('Trainee removed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to remove trainee: ${error.message}`);
    }
  });

  const updateNotes = useMutation({
    mutationFn: async ({ traineeId, notes }: { traineeId: string; notes: string }) => {
      const { error } = await supabase
        .from('coach_trainees')
        .update({ notes })
        .eq('coach_id', user?.id)
        .eq('trainee_id', traineeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainees'] });
      toast.success('Notes updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update notes: ${error.message}`);
    }
  });

  return {
    trainees,
    isLoading,
    assignTrainee: assignTrainee.mutate,
    removeTrainee: removeTrainee.mutate,
    updateNotes: updateNotes.mutate,
    isAssigning: assignTrainee.isPending,
    isRemoving: removeTrainee.isPending,
    isUpdatingNotes: updateNotes.isPending,
  };
};
