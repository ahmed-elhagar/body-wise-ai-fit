import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isLoading?: boolean;
}

interface UseChatOptions {
  systemPrompt?: string;
  maxMessages?: number;
}

export const useAIChat = (options: UseChatOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const { systemPrompt = "You are a helpful AI fitness assistant.", maxMessages = 50 } = options;

  const addMessage = useCallback((content: string, role: 'user' | 'assistant', isLoading = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      role,
      timestamp: new Date(),
      isLoading,
    };

    setMessages(prev => {
      const updated = [...prev, newMessage];
      // Keep only the last maxMessages
      return updated.slice(-maxMessages);
    });

    return newMessage.id;
  }, [maxMessages]);

  const updateMessage = useCallback((messageId: string, content: string, isLoading = false) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content, isLoading }
        : msg
    ));
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    // Add user message
    addMessage(userMessage.trim(), 'user');
    
    // Add loading assistant message
    const assistantMessageId = addMessage('', 'assistant', true);
    setIsLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add system message and current user message
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage.trim() }
      ];

      console.log('🤖 Sending message to AI:', { userMessage, historyLength: conversationHistory.length });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Update the loading message with the response
      updateMessage(assistantMessageId, data.response || 'Sorry, I could not generate a response.', false);
      
      console.log('✅ AI response received');

    } catch (error: any) {
      console.error('❌ Error sending message to AI:', error);
      
      if (error.name === 'AbortError') {
        // Request was cancelled, remove the loading message
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      } else {
        // Update loading message with error
        updateMessage(
          assistantMessageId, 
          'Sorry, I encountered an error. Please try again.', 
          false
        );
        toast.error('Failed to get AI response. Please try again.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, systemPrompt, addMessage, updateMessage]);

  const regenerateLastMessage = useCallback(() => {
    if (messages.length < 2) return;

    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message
    setMessages(prev => {
      const filtered = prev.filter(msg => 
        !(msg.role === 'assistant' && msg.timestamp > lastUserMessage.timestamp)
      );
      return filtered;
    });

    // Resend the last user message
    sendMessage(lastUserMessage.content);
  }, [messages, sendMessage]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    regenerateLastMessage,
    clearConversation,
    cancelRequest,
  };
};
