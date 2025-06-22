
import { useState, useEffect } from 'react';

interface AdminStatsData {
  totalUsers: number;
  activeSubscriptions: number;
  activeSessions: number;
  totalGenerations: number;
  recentSignups: number;
  adminCount: number;
  coachCount: number;
}

export interface AdminStats {
  data: AdminStatsData | null;
  isLoading: boolean;
  error: Error | null;
}

export const useAdminStats = (): AdminStats => {
  const [data, setData] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock data - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData({
          totalUsers: 1250,
          activeSubscriptions: 89,
          activeSessions: 234,
          totalGenerations: 15420,
          recentSignups: 23,
          adminCount: 3,
          coachCount: 12
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, isLoading, error };
};
