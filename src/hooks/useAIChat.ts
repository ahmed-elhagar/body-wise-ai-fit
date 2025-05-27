
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useAIChat = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async ({ message, chatHistory }: { message: string; chatHistory?: any[] }) => {
      if (!user?.id) {
        throw new Error('Please sign in to use AI chat');
      }

      const { data, error } = await supabase.functions.invoke('fitness-chat', {
        body: {
          message,
          userProfile: profile,
          chatHistory: chatHistory || []
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
          prompt_data: { message, chatHistory },
          response_data: { response: data.response }
        });

      return data.response;
    },
    onError: (error: any) => {
      console.error('Error in AI chat:', error);
      toast.error('Failed to send message');
    },
  });

  return {
    sendMessage: sendMessage.mutate,
    isLoading: sendMessage.isPending,
  };
};
