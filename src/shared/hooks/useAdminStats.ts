import { useState, useEffect } from 'react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGenerations: number;
  todayGenerations: number;
  loading: boolean;
  error: string | null;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalGenerations: 0,
    todayGenerations: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    const fetchStats = async () => {
      try {
        setStats({
          totalUsers: 1250,
          activeUsers: 847,
          totalGenerations: 15420,
          todayGenerations: 156,
          loading: false,
          error: null
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch stats'
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
