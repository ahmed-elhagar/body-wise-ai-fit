
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface SendMessageOptions {
  onSuccess?: (data: string) => void;
  onError?: (error: any) => void;
}

export const useAIChat = () => {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (message: string, options?: SendMessageOptions) => {
    if (!user?.id) {
      options?.onError?.(new Error('User not authenticated'));
      return;
    }

    setIsSending(true);
    console.log('🤖 Sending AI chat message:', message);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call the AI chat edge function
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          message,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ AI response:', data);
      
      const responseText = data.response || 'Sorry, I couldn\'t generate a response.';
      options?.onSuccess?.(responseText);
      
      // Update chat history
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date(),
      };
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, userMessage, assistantMessage]);
      
    } catch (error) {
      console.error('❌ AI chat error:', error);
      options?.onError?.(error);
    } finally {
      setIsSending(false);
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
  };

  return {
    sendMessage,
    chatHistory,
    isSending,
    clearHistory,
  };
};
