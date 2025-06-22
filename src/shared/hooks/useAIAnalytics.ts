
import { useState, useCallback } from 'react';

interface AIAnalytics {
  totalMessages: number;
  avgResponseTime: number;
  engagementScore: number;
  aiHelpfulness: number;
  sentimentTrend: string;
  topTopics: string[];
}

export const useAIAnalytics = () => {
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);

  const analyzeConversation = useCallback((messages: Array<{ role: string; content: string; timestamp?: number }>) => {
    if (!messages || messages.length === 0) return null;

    const totalMessages = messages.length;
    const avgResponseTime = 1500; // Mock average response time
    const engagementScore = Math.min(95, totalMessages * 5);
    const aiHelpfulness = Math.min(90, totalMessages * 4);
    const sentimentTrend = 'positive';
    
    // Extract topics from messages
    const topTopics = messages
      .map(m => m.content.toLowerCase())
      .join(' ')
      .split(' ')
      .filter(word => ['workout', 'nutrition', 'diet', 'exercise', 'fitness'].includes(word))
      .slice(0, 5);

    const result = {
      totalMessages,
      avgResponseTime,
      engagementScore,
      aiHelpfulness,
      sentimentTrend,
      topTopics: Array.from(new Set(topTopics))
    };

    setAnalytics(result);
    return result;
  }, []);

  const generateInsights = useCallback((analyticsData: AIAnalytics) => {
    const insights = [];
    
    if (analyticsData.engagementScore > 80) {
      insights.push("Great conversation engagement! Users are actively participating.");
    }
    
    if (analyticsData.aiHelpfulness > 85) {
      insights.push("AI responses are highly helpful and relevant.");
    }
    
    if (analyticsData.topTopics.length > 0) {
      insights.push(`Main discussion topics: ${analyticsData.topTopics.join(', ')}`);
    }

    return insights;
  }, []);

  return {
    analytics,
    analyzeConversation,
    generateInsights
  };
};
