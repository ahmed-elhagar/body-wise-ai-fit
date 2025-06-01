
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  activeSessions: number;
  activeSubscriptions: number;
  totalGenerations: number;
  coachCount: number;
  adminCount: number;
  recentSignups: number;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('🔄 Fetching admin stats...');

      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error fetching users count:', usersError);
        throw usersError;
      }

      // Get active sessions count
      const { count: activeSessions, error: sessionsError } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true })
        .gte('last_activity', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (sessionsError) {
        console.error('Error fetching sessions count:', sessionsError);
      }

      // Get active subscriptions count
      const { count: activeSubscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (subscriptionsError) {
        console.error('Error fetching subscriptions count:', subscriptionsError);
      }

      // Get total AI generations count
      const { count: totalGenerations, error: generationsError } = await supabase
        .from('ai_generation_logs')
        .select('*', { count: 'exact', head: true });

      if (generationsError) {
        console.error('Error fetching generations count:', generationsError);
      }

      // Get coach count
      const { count: coachCount, error: coachError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['coach', 'admin']);

      if (coachError) {
        console.error('Error fetching coach count:', coachError);
      }

      // Get admin count
      const { count: adminCount, error: adminError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      if (adminError) {
        console.error('Error fetching admin count:', adminError);
      }

      // Get recent signups (last 7 days)
      const { count: recentSignups, error: recentSignupsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (recentSignupsError) {
        console.error('Error fetching recent signups:', recentSignupsError);
      }

      const stats = {
        totalUsers: totalUsers || 0,
        activeSessions: activeSessions || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalGenerations: totalGenerations || 0,
        coachCount: coachCount || 0,
        adminCount: adminCount || 0,
        recentSignups: recentSignups || 0,
      };

      console.log('✅ Admin stats fetched:', stats);
      return stats;
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });
};
