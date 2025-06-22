
import { useState, useCallback } from 'react';

interface SmartReply {
  id: string;
  text: string;
  category: 'question' | 'feedback' | 'request' | 'acknowledgment';
  relevanceScore: number;
}

export const useSmartReplies = () => {
  const [replies, setReplies] = useState<SmartReply[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReplies = useCallback(async (messageContext: string) => {
    setLoading(true);
    try {
      // Mock smart replies generation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockReplies: SmartReply[] = [
        { id: '1', text: 'Thank you!', category: 'acknowledgment', relevanceScore: 0.9 },
        { id: '2', text: 'Can you tell me more?', category: 'question', relevanceScore: 0.8 },
        { id: '3', text: 'That\'s helpful', category: 'feedback', relevanceScore: 0.7 },
      ];
      
      setReplies(mockReplies);
    } catch (error) {
      console.error('Error generating smart replies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearReplies = useCallback(() => {
    setReplies([]);
  }, []);

  return {
    replies,
    loading,
    generateReplies,
    clearReplies
  };
};
