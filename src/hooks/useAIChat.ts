
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { useState } from 'react';

export const useAIChat = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  const sendMessage = useMutation({
    mutationFn: async ({ message, chatHistory: currentHistory }: { message: string; chatHistory?: any[] }) => {
      if (!user?.id) {
        throw new Error('Please sign in to use AI chat');
      }

      const { data, error } = await supabase.functions.invoke('fitness-chat', {
        body: {
          message,
          userProfile: profile,
          chatHistory: currentHistory || chatHistory
        }
      });

      if (error) throw error;

      // Log the chat interaction
      await supabase
        .from('ai_generation_logs')
        .insert({
          user_id: user.id,
          generation_type: 'fitness_chat',
          status: 'completed',
          prompt_data: { message, chatHistory: currentHistory || chatHistory },
          response_data: { response: data.response }
        });

      // Update local chat history
      const newUserMessage = { message_type: 'user', message, created_at: new Date().toISOString() };
      const newAiMessage = { message_type: 'assistant', response: data.response, created_at: new Date().toISOString() };
      
      setChatHistory(prev => [...prev, newUserMessage, newAiMessage]);

      return data.response;
    },
    onError: (error: any) => {
      console.error('Error in AI chat:', error);
      toast.error('Failed to send message');
    },
  });

  return {
    sendMessage: (message: string) => sendMessage.mutate({ message, chatHistory }),
    isSending: sendMessage.isPending,
    chatHistory,
  };
};
