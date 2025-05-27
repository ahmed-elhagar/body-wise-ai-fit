
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { useState } from 'react';

interface ChatMessage {
  id: string;
  message_type: 'user' | 'assistant';
  message?: string;
  response?: string;
  created_at: string;
}

export const useAIChat = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!user?.id) {
        throw new Error('Please sign in to use AI chat');
      }

      console.log('Sending message:', message);
      console.log('Current chat history:', chatHistory);

      const { data, error } = await supabase.functions.invoke('fitness-chat', {
        body: {
          message,
          userProfile: profile,
          chatHistory: chatHistory
        }
      });

      if (error) {
        console.error('AI chat error:', error);
        throw error;
      }

      console.log('AI response received:', data);

      // Log the chat interaction
      try {
        await supabase
          .from('ai_generation_logs')
          .insert({
            user_id: user.id,
            generation_type: 'fitness_chat',
            status: 'completed',
            prompt_data: { message, chatHistory },
            response_data: { response: data.response }
          });
      } catch (logError) {
        console.error('Failed to log chat interaction:', logError);
        // Don't throw here, as the main functionality worked
      }

      // Update local chat history
      const newUserMessage: ChatMessage = { 
        id: Date.now().toString(), 
        message_type: 'user', 
        message, 
        created_at: new Date().toISOString() 
      };
      const newAiMessage: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        message_type: 'assistant', 
        response: data.response, 
        created_at: new Date().toISOString() 
      };
      
      setChatHistory(prev => [...prev, newUserMessage, newAiMessage]);

      return data.response;
    },
    onError: (error: any) => {
      console.error('Error in AI chat:', error);
      toast.error('Failed to send message. Please try again.');
    },
  });

  const clearHistory = () => {
    setChatHistory([]);
  };

  return {
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
    chatHistory,
    clearHistory,
  };
};
