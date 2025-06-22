
import { useState, useCallback, useMemo } from 'react';

interface SmartReply {
  id: string;
  text: string;
  category: 'question' | 'feedback' | 'request' | 'acknowledgment';
  relevanceScore: number;
}

export const useSmartReplies = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const replyTemplates = useMemo(() => ({
    workout: [
      "Can you create a workout plan for me?",
      "What exercises are best for beginners?",
      "How often should I exercise?",
      "I need help with my form",
      "What's a good warm-up routine?"
    ],
    nutrition: [
      "Can you suggest healthy meal ideas?",
      "How many calories should I eat?",
      "What are good protein sources?",
      "I need help with meal planning",
      "What foods should I avoid?"
    ],
    motivation: [
      "I'm struggling to stay motivated",
      "How do I build healthy habits?",
      "I need encouragement",
      "What keeps you going?",
      "How do I overcome plateaus?"
    ],
    progress: [
      "How do I track my progress?",
      "I'm not seeing results",
      "Should I change my routine?",
      "How long until I see changes?",
      "Am I doing this right?"
    ],
    general: [
      "Thank you for the help!",
      "That's very helpful",
      "Can you explain more?",
      "I have another question",
      "This is exactly what I needed"
    ]
  }), []);

  const generateSmartReplies = useCallback(async (
    lastMessage: string, 
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<SmartReply[]> => {
    setIsGenerating(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const generalReplies = [
        "Thank you!",
        "That's helpful",
        "Can you tell me more?",
        "I understand",
        "What about...?"
      ];

      // Generate smart replies with relevance scoring and proper typing
      const smartReplies: SmartReply[] = generalReplies
        .slice(0, 6) // Limit to 6 suggestions
        .map((text, index) => {
          let category: 'question' | 'feedback' | 'request' | 'acknowledgment';
          if (index < 3) {
            category = 'question';
          } else if (index < 5) {
            category = 'feedback';
          } else {
            category = 'acknowledgment';
          }

          return {
            id: `reply-${index}`,
            text,
            category,
            relevanceScore: Math.max(0.9 - (index * 0.1), 0.3)
          };
        })
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      return smartReplies;
    } catch (error) {
      console.error('Error generating smart replies:', error);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateSmartReplies,
    isGenerating
  };
};
