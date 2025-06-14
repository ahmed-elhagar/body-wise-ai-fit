
import { useState } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date | number;
}

interface UseAIChatOptions {
  systemPrompt?: string;
  maxMessages?: number;
}

export const useAIChat = (options?: UseAIChatOptions) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Mock AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for your message: "${message}". I'm here to help with your fitness and health questions!`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const regenerateLastMessage = async () => {
    const lastAssistantMessage = messages.findLast(m => m.role === 'assistant');
    if (lastAssistantMessage) {
      setIsLoading(true);
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === lastAssistantMessage.id 
            ? { ...msg, content: `Regenerated: ${msg.content}` }
            : msg
        ));
        setIsLoading(false);
      }, 1000);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const cancelRequest = () => {
    setIsLoading(false);
  };

  return {
    messages,
    isLoading,
    sendMessage,
    regenerateLastMessage,
    clearConversation,
    cancelRequest
  };
};
