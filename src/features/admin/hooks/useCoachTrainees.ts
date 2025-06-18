
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { CoachTrainee } from '../types';

export const useCoachTrainees = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: trainees = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['coach-trainees', user?.id],
    queryFn: async (): Promise<CoachTrainee[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('coach_trainees')
        .select(`
          *,
          trainee:trainee_id(
            id,
            first_name,
            last_name,
            email,
            role,
            created_at,
            last_seen,
            is_online
          )
        `)
        .eq('coach_id', user.id)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      
      // Map to proper type structure
      return (data || []).map((item: any) => ({
        id: item.id,
        coach_id: item.coach_id,
        trainee_id: item.trainee_id,
        assigned_at: item.assigned_at,
        notes: item.notes,
        trainee: item.trainee ? {
          id: item.trainee.id,
          email: item.trainee.email,
          first_name: item.trainee.first_name,
          last_name: item.trainee.last_name,
          role: item.trainee.role as 'admin' | 'coach' | 'normal',
          created_at: item.trainee.created_at,
          last_seen: item.trainee.last_seen,
          is_online: item.trainee.is_online,
        } : undefined,
      }));
    },
    enabled: !!user?.id,
  });

  const assignTraineeMutation = useMutation({
    mutationFn: async ({ traineeId, notes }: { traineeId: string; notes?: string }) => {
      if (!user?.id) throw new Error('Coach not authenticated');

      const { data, error } = await supabase
        .from('coach_trainees')
        .insert({
          coach_id: user.id,
          trainee_id: traineeId,
          notes,
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
      console.error('Error assigning trainee:', error);
      toast.error('Failed to assign trainee');
    },
  });

  const updateNotesMutation = useMutation({
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
      console.error('Error updating notes:', error);
      toast.error('Failed to update notes');
    },
  });

  return {
    trainees,
    isLoading,
    error,
    refetch,
    assignTrainee: assignTraineeMutation.mutate,
    updateNotes: updateNotesMutation.mutate,
    isAssigning: assignTraineeMutation.isPending,
    isUpdatingNotes: updateNotesMutation.isPending,
  };
};
