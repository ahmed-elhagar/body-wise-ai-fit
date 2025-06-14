
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  sender_name?: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
}

interface SendMessageParams {
  message: string;
}

export const useCoachChat = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['coach-chat-messages', coachId, traineeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('*')
        .eq('coach_id', coachId)
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!(coachId && traineeId)
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }: SendMessageParams) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('coach_trainee_messages')
        .insert({
          coach_id: coachId,
          trainee_id: traineeId,
          sender_id: user.id,
          sender_type: user.role === 'coach' ? 'coach' : 'trainee',
          message: message.trim()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-chat-messages', coachId, traineeId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  });

  const sendMessage = useCallback(
    (params: SendMessageParams) => sendMessageMutation.mutate(params),
    [sendMessageMutation]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    isSending: sendMessageMutation.isPending
  };
};
