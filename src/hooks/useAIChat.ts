
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useAIChat = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: chatHistory, isLoading } = useQuery({
    queryKey: ['chat-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Save user message
      const { error: saveError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message,
          message_type: 'user'
        });

      if (saveError) throw saveError;

      // Get AI response
      const { data, error } = await supabase.functions.invoke('fitness-chat', {
        body: {
          message,
          userProfile: profile,
          chatHistory: chatHistory?.map(msg => ({
            role: msg.message_type === 'user' ? 'user' : 'assistant',
            content: msg.message_type === 'user' ? msg.message : msg.response
          }))
        }
      });

      if (error) throw error;

      // Save AI response
      const { error: responseError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: data.response,
          message_type: 'assistant'
        });

      if (responseError) throw responseError;

      return data.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', user?.id] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    },
  });

  return {
    chatHistory,
    isLoading,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  };
};
