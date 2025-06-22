import { useState, useEffect } from 'react';

interface AIAnalytics {
  totalConversations: number;
  averageResponseTime: number;
  satisfactionScore: number;
  topTopics: string[];
  loading: boolean;
  error: string | null;
}

export const useAIAnalytics = () => {
  const [analytics, setAnalytics] = useState<AIAnalytics>({
    totalConversations: 0,
    averageResponseTime: 0,
    satisfactionScore: 0,
    topTopics: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Mock data - replace with actual API call
        setTimeout(() => {
          setAnalytics({
            totalConversations: 1247,
            averageResponseTime: 2.3,
            satisfactionScore: 4.7,
            topTopics: ['Meal Planning', 'Exercise Routines', 'Nutrition', 'Weight Loss'],
            loading: false,
            error: null
          });
        }, 1000);
      } catch (error) {
        setAnalytics(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch analytics'
        }));
      }
    };

    fetchAnalytics();
  }, []);

  return analytics;
};
