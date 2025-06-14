
import { useState } from 'react';

export const useSmartReplies = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSmartReplies = async (lastMessage: string, conversationHistory: any[]) => {
    setIsGenerating(true);
    try {
      // Mock smart replies
      setTimeout(() => {
        setSuggestions([
          "Can you tell me more about that?",
          "That's helpful, thank you!",
          "What would you recommend for my situation?"
        ]);
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
