
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { CoachChatMessage } from '../types';

export const useCoachChat = (traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const coachId = user?.id || '';

  // Fetch messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['coach-trainee-messages', coachId, traineeId],
    queryFn: async () => {
      if (!coachId || !traineeId) return [];

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select('*')
        .eq('coach_id', coachId)
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      return data as CoachChatMessage[];
    },
    enabled: !!coachId && !!traineeId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!coachId || !traineeId) throw new Error('Missing required data');

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .insert({
          coach_id: coachId,
          trainee_id: traineeId,
          sender_id: coachId,
          sender_type: 'coach',
          message: messageText,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      toast.success('Message sent successfully');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    },
  });

  // Mark messages as read
  const markAsRead = async () => {
    if (!coachId || !traineeId) return;

    const unreadMessages = messages.filter(
      msg => !msg.is_read && msg.sender_type === 'trainee'
    );

    if (unreadMessages.length > 0) {
      await supabase
        .from('coach_trainee_messages')
        .update({ is_read: true })
        .in('id', unreadMessages.map(msg => msg.id));

      queryClient.invalidateQueries({ queryKey: ['coach-trainee-messages'] });
      queryClient.invalidateQueries({ queryKey: ['unread-messages'] });
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    markAsRead,
  };
};
