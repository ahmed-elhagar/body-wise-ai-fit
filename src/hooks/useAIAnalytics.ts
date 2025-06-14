
import { useState, useEffect } from 'react';

interface ConversationAnalytics {
  totalMessages: number;
  avgResponseTime: number;
  engagementScore: number;
  aiHelpfulness: number;
  sentimentTrend: 'positive' | 'negative' | 'neutral';
  topTopics: string[];
}

export const useAIAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalConversations: 0,
    averageResponseTime: 0,
    userSatisfaction: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock analytics data
    setTimeout(() => {
      setAnalytics({
        totalConversations: 150,
        averageResponseTime: 2.3,
        userSatisfaction: 4.2
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const analyzeConversation = (messages: any[]): ConversationAnalytics => {
    return {
      totalMessages: messages.length,
      avgResponseTime: 2500,
      engagementScore: 85,
      aiHelpfulness: 90,
      sentimentTrend: 'positive',
      topTopics: ['nutrition', 'exercise', 'weight-loss']
    };
  };

  const generateInsights = (analytics: ConversationAnalytics): string[] => {
    return [
      'User engagement is high with frequent follow-up questions',
      'Nutrition topics generate the most interest',
      'Response times are optimal for user satisfaction'
    ];
  };

  return {
    analytics,
    isLoading,
    analyzeConversation,
    generateInsights
  };
};
