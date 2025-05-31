
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SendMessageOptions {
  onSuccess?: (data: string) => void;
  onError?: (error: any) => void;
}

export const useAIChat = () => {
  const { user } = useAuth();

  const sendMessage = (message: string, options?: SendMessageOptions) => {
    if (!user?.id) {
      options?.onError?.(new Error('User not authenticated'));
      return;
    }

    console.log('🤖 Sending AI chat message:', message);

    // Call the AI chat edge function
    fetch('/api/ai-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`,
      },
      body: JSON.stringify({
        message,
        userId: user.id,
      }),
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ AI response:', data);
      options?.onSuccess?.(data.response || 'Sorry, I couldn\'t generate a response.');
    })
    .catch((error) => {
      console.error('❌ AI chat error:', error);
      options?.onError?.(error);
    });
  };

  return {
    sendMessage,
  };
};
