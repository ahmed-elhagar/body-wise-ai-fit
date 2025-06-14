
import { useState } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  created_at: Date;
  is_read: boolean;
}

export const useCoachChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (content: string, recipientId: string) => {
    setIsSending(true);
    try {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        sender_id: 'current-user',
        sender_type: 'coach',
        created_at: new Date(),
        is_read: false
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return {
    conversations,
    messages,
    isLoading,
    isSending,
    sendMessage
  };
};
