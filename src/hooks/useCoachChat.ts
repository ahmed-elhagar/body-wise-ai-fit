
import { useState } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  message: string; // For compatibility
  sender_id: string;
  sender_type: 'coach' | 'trainee';
  sender_name?: string;
  created_at: string;
  is_read: boolean;
}

export const useCoachChat = (coachId?: string, traineeId?: string) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (messageData: { message: string } | string) => {
    setIsSending(true);
    try {
      const content = typeof messageData === 'string' ? messageData : messageData.message;
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        message: content,
        sender_id: 'current-user',
        sender_type: 'coach',
        created_at: new Date().toISOString(),
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
