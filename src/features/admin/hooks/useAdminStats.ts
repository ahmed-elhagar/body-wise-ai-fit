
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AdminStats } from '../types';

export const useAdminStats = () => {
  const {
    data: stats,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', thirtyDaysAgo.toISOString());

      // Get coaches
      const { count: totalCoaches } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'coach');

      // Get total subscriptions
      const { count: totalSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true });

      // Get active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get AI generations today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count: aiGenerationsToday } = await supabase
        .from('ai_generation_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalCoaches: totalCoaches || 0,
        totalTrainees: (totalUsers || 0) - (totalCoaches || 0),
        totalSubscriptions: totalSubscriptions || 0,
        activeSubscriptions: activeSubscriptions || 0,
        monthlyRevenue: 0, // TODO: Calculate from Stripe data
        aiGenerationsToday: aiGenerationsToday || 0,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};
