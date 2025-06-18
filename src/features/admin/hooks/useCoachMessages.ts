
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { CoachMessage } from '../types';

export const useCoachMessages = (traineeId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: messages = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['coach-messages', user?.id, traineeId],
    queryFn: async (): Promise<CoachMessage[]> => {
      if (!user?.id || !traineeId) return [];

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('*')
        .eq('coach_id', user.id)
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Map to proper type with casting
      return (data || []).map((message: any) => ({
        id: message.id,
        coach_id: message.coach_id,
        trainee_id: message.trainee_id,
        sender_id: message.sender_id,
        sender_type: message.sender_type as 'coach' | 'trainee',
        message: message.message,
        message_type: message.message_type as 'text' | 'file' | 'system',
        is_read: message.is_read,
        created_at: message.created_at,
        updated_at: message.updated_at,
      }));
    },
    enabled: !!user?.id && !!traineeId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, traineeId: targetTraineeId }: { message: string; traineeId: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .insert({
          coach_id: user.id,
          trainee_id: targetTraineeId,
          sender_id: user.id,
          sender_type: 'coach',
          message,
          message_type: 'text',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-messages'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('coach_trainee_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-messages'] });
    },
  });

  return {
    messages,
    isLoading,
    error,
    refetch,
    sendMessage: sendMessageMutation.mutate,
    markAsRead: markAsReadMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
};
