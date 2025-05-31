
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

  const analyzeContext = useCallback((lastMessage: string, conversationHistory: Array<{ role: string; content: string }>) => {
    const content = lastMessage.toLowerCase();
    const recentTopics = conversationHistory.slice(-5).map(m => m.content.toLowerCase()).join(' ');
    
    const topicScores = {
      workout: 0,
      nutrition: 0,
      motivation: 0,
      progress: 0,
      general: 0
    };

    // Analyze current message
    if (content.includes('workout') || content.includes('exercise') || content.includes('training')) {
      topicScores.workout += 3;
    }
    if (content.includes('food') || content.includes('eat') || content.includes('diet') || content.includes('nutrition')) {
      topicScores.nutrition += 3;
    }
    if (content.includes('motivat') || content.includes('struggle') || content.includes('difficult')) {
      topicScores.motivation += 3;
    }
    if (content.includes('progress') || content.includes('result') || content.includes('change')) {
      topicScores.progress += 3;
    }

    // Analyze recent conversation context
    Object.keys(topicScores).forEach(topic => {
      if (recentTopics.includes(topic)) {
        topicScores[topic as keyof typeof topicScores] += 1;
      }
    });

    // Determine primary topic
    const primaryTopic = Object.entries(topicScores).reduce((a, b) => 
      topicScores[a[0] as keyof typeof topicScores] > topicScores[b[0] as keyof typeof topicScores] ? a : b
    )[0];

    return primaryTopic === 'general' || topicScores[primaryTopic as keyof typeof topicScores] === 0 
      ? 'general' 
      : primaryTopic;
  }, []);

  const generateSmartReplies = useCallback(async (
    lastMessage: string, 
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<SmartReply[]> => {
    setIsGenerating(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const context = analyzeContext(lastMessage, conversationHistory);
      const contextReplies = replyTemplates[context as keyof typeof replyTemplates] || replyTemplates.general;
      
      // Add some general replies
      const generalReplies = [
        "Thank you!",
        "That's helpful",
        "Can you tell me more?",
        "I understand",
        "What about...?"
      ];

      // Combine and score replies
      const allReplies = [...contextReplies, ...generalReplies];
      
      // Generate smart replies with relevance scoring
      const smartReplies: SmartReply[] = allReplies
        .slice(0, 6) // Limit to 6 suggestions
        .map((text, index) => ({
          id: `reply-${index}`,
          text,
          category: index < 3 ? 'question' : index < 5 ? 'feedback' : 'acknowledgment',
          relevanceScore: Math.max(0.9 - (index * 0.1), 0.3) // Higher score for earlier suggestions
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore);

      return smartReplies;
    } catch (error) {
      console.error('Error generating smart replies:', error);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [analyzeContext, replyTemplates]);

  const generateQuickActions = useCallback((context: string) => {
    const actions = {
      workout: [
        { text: "🏋️ Create workout plan", action: "create_workout" },
        { text: "💪 Exercise library", action: "browse_exercises" },
        { text: "⏱️ Quick workout", action: "quick_workout" }
      ],
      nutrition: [
        { text: "🥗 Meal planning", action: "meal_plan" },
        { text: "🔍 Food tracker", action: "food_tracker" },
        { text: "📊 Nutrition info", action: "nutrition_info" }
      ],
      progress: [
        { text: "📈 View progress", action: "view_progress" },
        { text: "🎯 Set new goal", action: "set_goal" },
        { text: "📸 Progress photo", action: "progress_photo" }
      ]
    };

    return actions[context as keyof typeof actions] || [];
  }, []);

  return {
    generateSmartReplies,
    generateQuickActions,
    isGenerating
  };
};
