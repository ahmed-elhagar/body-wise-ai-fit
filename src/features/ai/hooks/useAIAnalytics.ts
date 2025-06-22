
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface ConversationAnalytics {
  totalMessages: number;
  avgResponseTime: number;
  topTopics: string[];
  sentimentTrend: 'positive' | 'neutral' | 'negative';
  engagementScore: number;
  aiHelpfulness: number;
}

interface MessageSentiment {
  score: number;
  magnitude: number;
  label: 'positive' | 'neutral' | 'negative';
}

export const useAIAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ConversationAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeMessageSentiment = useCallback((message: string): MessageSentiment => {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'helpful', 'thank', 'love', 'perfect', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'wrong', 'error', 'problem', 'issue', 'difficult'];
    
    const words = message.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const score = (positiveCount - negativeCount) / Math.max(words.length, 1);
    const magnitude = Math.abs(score);
    
    let label: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (score > 0.1) label = 'positive';
    else if (score < -0.1) label = 'negative';
    
    return { score, magnitude, label };
  }, []);

  const extractTopics = useCallback((messages: Array<{ content: string }>) => {
    const topics = new Map<string, number>();
    const fitnessKeywords = {
      'workout': ['workout', 'exercise', 'training', 'gym'],
      'nutrition': ['nutrition', 'diet', 'food', 'meal', 'eating'],
      'weight': ['weight', 'lose', 'gain', 'scale'],
      'health': ['health', 'wellness', 'medical', 'doctor'],
      'goals': ['goal', 'target', 'objective', 'plan'],
      'motivation': ['motivation', 'inspire', 'encourage', 'support']
    };
    
    messages.forEach(message => {
      const content = message.content.toLowerCase();
      Object.entries(fitnessKeywords).forEach(([topic, keywords]) => {
        const count = keywords.filter(keyword => content.includes(keyword)).length;
        if (count > 0) {
          topics.set(topic, (topics.get(topic) || 0) + count);
        }
      });
    });
    
    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }, []);

  const analyzeConversation = useCallback((messages: Array<{ 
    role: 'user' | 'assistant'; 
    content: string; 
    timestamp?: number;
  }>) => {
    if (!messages.length) return null;

    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    // Calculate average response time (mock data for now)
    const avgResponseTime = Math.random() * 3000 + 1000; // 1-4 seconds
    
    // Analyze sentiment
    const sentiments = userMessages.map(m => analyzeMessageSentiment(m.content));
    const avgSentiment = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
    
    let sentimentTrend: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (avgSentiment > 0.1) sentimentTrend = 'positive';
    else if (avgSentiment < -0.1) sentimentTrend = 'negative';
    
    // Extract topics
    const topTopics = extractTopics(messages);
    
    // Calculate engagement score based on message length and frequency
    const avgMessageLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
    const engagementScore = Math.min(Math.max((avgMessageLength / 50) * 100, 0), 100);
    
    // Calculate AI helpfulness (mock based on positive sentiment and follow-up questions)
    const followUpQuestions = userMessages.filter(m => 
      m.content.includes('?') || m.content.toLowerCase().includes('how') || 
      m.content.toLowerCase().includes('what') || m.content.toLowerCase().includes('can you')
    ).length;
    
    const aiHelpfulness = Math.min(
      (sentiments.filter(s => s.label === 'positive').length / sentiments.length) * 50 +
      (followUpQuestions / userMessages.length) * 50,
      100
    );

    return {
      totalMessages: messages.length,
      avgResponseTime,
      topTopics,
      sentimentTrend,
      engagementScore: Math.round(engagementScore),
      aiHelpfulness: Math.round(aiHelpfulness)
    };
  }, [analyzeMessageSentiment, extractTopics]);

  const generateInsights = useCallback((analytics: ConversationAnalytics) => {
    const insights: string[] = [];
    
    if (analytics.sentimentTrend === 'positive') {
      insights.push('Your conversations have a positive tone! 😊');
    } else if (analytics.sentimentTrend === 'negative') {
      insights.push('Consider asking more specific questions for better help 🤔');
    }
    
    if (analytics.engagementScore > 80) {
      insights.push('You\'re highly engaged in your fitness journey! 💪');
    } else if (analytics.engagementScore < 40) {
      insights.push('Try asking more detailed questions for personalized advice 📝');
    }
    
    if (analytics.aiHelpfulness > 80) {
      insights.push('AI responses are highly relevant to your needs! ✨');
    }
    
    if (analytics.topTopics.includes('workout') && analytics.topTopics.includes('nutrition')) {
      insights.push('Great balance between fitness and nutrition topics! 🥗💪');
    }
    
    return insights;
  }, []);

  return {
    analytics,
    analyzeConversation,
    analyzeMessageSentiment,
    generateInsights,
    isLoading
  };
};
