
import { useState } from 'react';

export const useAIChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    // Mock implementation
    setMessages(prev => [...prev, { id: Date.now(), text: message, sender: 'user' }]);
    setIsLoading(false);
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};
