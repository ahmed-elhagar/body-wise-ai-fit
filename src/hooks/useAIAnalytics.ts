
import { useState, useEffect } from 'react';

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

  return {
    analytics,
    isLoading
  };
};
