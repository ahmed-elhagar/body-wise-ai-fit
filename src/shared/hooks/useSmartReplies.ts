import { useState, useEffect } from 'react';

interface SmartReply {
  id: string;
  text: string;
  category: 'greeting' | 'question' | 'response' | 'action';
}

export const useSmartReplies = (context?: string) => {
  const [replies, setReplies] = useState<SmartReply[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReplies = async (messageContext: string) => {
    setLoading(true);
    
    // Mock smart replies based on context
    const mockReplies: SmartReply[] = [
      { id: '1', text: 'Thanks for the information!', category: 'response' },
      { id: '2', text: 'Can you tell me more about this?', category: 'question' },
      { id: '3', text: 'That sounds great!', category: 'response' },
      { id: '4', text: 'Let me check on that for you.', category: 'action' }
    ];

    // Simulate API delay
    setTimeout(() => {
      setReplies(mockReplies);
      setLoading(false);
    }, 500);
  };

  const clearReplies = () => {
    setReplies([]);
  };

  return {
    replies,
    loading,
    generateReplies,
    clearReplies
  };
};
