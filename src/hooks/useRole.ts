
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'normal' | 'pro' | 'coach' | 'admin';

interface RoleCapabilities {
  role: UserRole;
  isPro: boolean;
  isCoach: boolean;
  isAdmin: boolean;
  canAccessUnlimitedAI: boolean;
  canManageTrainees: boolean;
  canAccessBilling: boolean;
}

export const useRole = () => {
  const { user } = useAuth();

  const { data: roleData, isLoading, refetch } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log('useRole - Fetching role for user:', user.id);

      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('useRole - Profile error:', profileError);
        throw profileError;
      }

      console.log('useRole - Profile role:', profile.role);

      // Check if user has active subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString())
        .maybeSingle();

      if (subError && subError.code !== 'PGRST116') {
        console.error('useRole - Subscription error:', subError);
        throw subError;
      }

      console.log('useRole - Active subscription:', subscription);

      const role = profile.role as UserRole;
      // Pro users are those with 'pro' role OR active subscription OR admin role
      const isPro = !!subscription || role === 'pro' || role === 'admin';
      const isCoach = role === 'coach' || role === 'admin';
      const isAdmin = role === 'admin';

      console.log('useRole - Calculated capabilities:', { role, isPro, isCoach, isAdmin });

      const capabilities: RoleCapabilities = {
        role,
        isPro,
        isCoach,
        isAdmin,
        canAccessUnlimitedAI: isPro,
        canManageTrainees: isCoach,
        canAccessBilling: role === 'normal' || role === 'pro',
      };

      return capabilities;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 30, // 30 seconds - shorter to catch updates faster
    refetchInterval: 5000, // Poll every 5 seconds to catch updates
  });

  return {
    ...roleData,
    isLoading,
    refetch,
  };
};
