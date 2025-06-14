
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ChatMessage {
  id: string;
  coach_id: string;
  trainee_id: string;
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  message: string;
  created_at: string;
  updated_at?: string;
  is_read: boolean;
}

export const useCoachChat = (coachId: string, traineeId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['coach-chat-messages', coachId, traineeId],
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

      return data as ChatMessage[];
    },
    enabled: !!coachId && !!traineeId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user?.id || !coachId || !traineeId) {
        throw new Error('Missing required data');
      }

      const { data, error } = await supabase
        .from('coach_trainee_messages')
        .insert({
          coach_id: coachId,
          trainee_id: traineeId,
          sender_id: user.id,
          sender_type: user.id === coachId ? 'coach' : 'trainee',
          message: messageText,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coach-chat-messages'] });
      setNewMessage('');
      setReplyingTo(null);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return {
    messages,
    isLoading,
    error,
    newMessage,
    setNewMessage,
    replyingTo,
    setReplyingTo,
    messagesEndRef,
    sendMessage: handleSendMessage,
    handleKeyPress,
    isSending: sendMessageMutation.isPending
  };
};
