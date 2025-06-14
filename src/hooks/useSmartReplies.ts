
import { useState } from 'react';

interface SmartReply {
  id: string;
  text: string;
  category: 'question' | 'feedback' | 'request' | 'acknowledgment';
  relevanceScore: number;
}

export const useSmartReplies = () => {
  const [suggestions, setSuggestions] = useState<SmartReply[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSmartReplies = async (lastMessage: string, conversationHistory: any[]) => {
    setIsGenerating(true);
    try {
      // Mock smart replies
      setTimeout(() => {
        const mockReplies: SmartReply[] = [
          {
            id: '1',
            text: "Can you tell me more about that?",
            category: 'question',
            relevanceScore: 0.9
          },
          {
            id: '2',
            text: "That's helpful, thank you!",
            category: 'acknowledgment',
            relevanceScore: 0.8
          },
          {
            id: '3',
            text: "What would you recommend for my situation?",
            category: 'request',
            relevanceScore: 0.85
          }
        ];
        setSuggestions(mockReplies);
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating smart replies:', error);
      setIsGenerating(false);
    }
  };

  return {
    suggestions,
    isGenerating,
    generateSmartReplies
  };
};
