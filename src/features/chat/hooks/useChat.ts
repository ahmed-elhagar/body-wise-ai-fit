
import { useState, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  message?: string; // For backward compatibility
  sender_id?: string; // For backward compatibility
  receiver_id?: string; // For backward compatibility
  message_text?: string; // For backward compatibility
  created_at?: string; // For backward compatibility
  updated_at?: string; // For backward compatibility
  is_read?: boolean; // For backward compatibility
  sender_name?: string; // For backward compatibility
  sender_type?: string; // For backward compatibility
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "This is a simulated AI response.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return {
    messages,
    sendMessage,
    isLoading
  };
};
