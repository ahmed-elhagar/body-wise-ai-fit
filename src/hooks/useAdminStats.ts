
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data: profiles } = await supabase.from('profiles').select('role');
      const { data: users } = await supabase.auth.admin.listUsers();
      
      return {
        totalUsers: users.users?.length || 0,
        activeSubscriptions: 0, // This would come from a subscription table
        activeSessions: 0, // This would come from session tracking
        totalGenerations: 0, // This would come from AI usage logs
        adminCount: profiles?.filter(p => p.role === 'admin').length || 0,
        coachCount: profiles?.filter(p => p.role === 'coach').length || 0,
        recentSignups: 0 // This would be calculated from recent user data
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
