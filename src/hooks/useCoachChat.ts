
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  coach_id: string;
  trainee_id: string;
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  message: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  message_type: 'text' | 'image' | 'file';
  sender_name?: string;
}

export const useCoachChat = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages for this coach-trainee pair
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['coach-chat-messages', coachId, traineeId],
    queryFn: async () => {
      if (!user?.id || !coachId || !traineeId) return [];

      console.log('🔄 Fetching chat messages for coach:', coachId, 'trainee:', traineeId);

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .select(`
          *,
          sender:profiles!sender_id(first_name, last_name)
        `)
        .eq('coach_id', coachId)
        .eq('trainee_id', traineeId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error fetching chat messages:', error);
        throw error;
      }

      // Transform the data to include sender names
      const transformedMessages: ChatMessage[] = data.map((msg: any) => ({
        ...msg,
        sender_name: msg.sender 
          ? `${msg.sender.first_name || ''} ${msg.sender.last_name || ''}`.trim() || 'Unknown'
          : 'Unknown'
      }));

      console.log('✅ Fetched messages:', transformedMessages.length);
      return transformedMessages;
    },
    enabled: !!user?.id && !!coachId && !!traineeId,
    refetchInterval: 5000, // Refetch every 5 seconds as fallback
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async ({ message, messageType = 'text' }: { message: string; messageType?: 'text' | 'image' | 'file' }) => {
      if (!user?.id || !message.trim()) {
        throw new Error('User not authenticated or message is empty');
      }

      console.log('📤 Sending message:', { coachId, traineeId, senderId: user.id, message });

      // Determine sender type based on user role
      const senderType = user.id === coachId ? 'coach' : 'trainee';

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .insert({
          coach_id: coachId,
          trainee_id: traineeId,
          sender_id: user.id,
          sender_type: senderType,
          message: message.trim(),
          message_type: messageType,
        })
        .select(`
          *,
          sender:profiles!sender_id(first_name, last_name)
        `)
        .single();

      if (error) {
        console.error('❌ Error sending message:', error);
        throw error;
      }

      console.log('✅ Message sent successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-chat-messages', coachId, traineeId] });
      toast.success('Message sent successfully');
    },
    onError: (error: Error) => {
      console.error('Error sending message:', error);
      toast.error(`Failed to send message: ${error.message}`);
    },
  });

  // Mark messages as read
  const markAsRead = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      const { error } = await supabase
        .from('coach_trainee_messages')
        .update({ is_read: true })
        .eq('coach_id', coachId)
        .eq('trainee_id', traineeId)
        .neq('sender_id', user.id)
        .eq('is_read', false);

      if (error) {
        console.error('❌ Error marking messages as read:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-chat-messages', coachId, traineeId] });
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!coachId || !traineeId) return;

    console.log('🔄 Setting up real-time chat subscription');

    const channel = supabase
      .channel(`chat-${coachId}-${traineeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `coach_id=eq.${coachId},trainee_id=eq.${traineeId}`,
        },
        (payload) => {
          console.log('📨 Real-time message received:', payload);
          queryClient.invalidateQueries({ queryKey: ['coach-chat-messages', coachId, traineeId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coach_trainee_messages',
          filter: `coach_id=eq.${coachId},trainee_id=eq.${traineeId}`,
        },
        (payload) => {
          console.log('📝 Real-time message updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['coach-chat-messages', coachId, traineeId] });
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Cleaning up chat subscription');
      supabase.removeChannel(channel);
    };
  }, [coachId, traineeId, queryClient]);

  // Auto-mark messages as read when viewing chat
  useEffect(() => {
    if (messages.length > 0 && user?.id) {
      const unreadMessages = messages.filter(msg => !msg.is_read && msg.sender_id !== user.id);
      if (unreadMessages.length > 0) {
        markAsRead.mutate();
      }
    }
  }, [messages, user?.id]);

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
    markAsRead: markAsRead.mutate,
  };
};
