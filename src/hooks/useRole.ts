
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
        .select('role, ai_generations_remaining')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('useRole - Profile error:', profileError);
        throw profileError;
      }

      console.log('useRole - Profile data:', profile);

      // Check if user has active subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('status, current_period_end, stripe_subscription_id')
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
      
      // User is Pro if:
      // 1. They have role 'pro' OR
      // 2. They have an active subscription OR  
      // 3. They are admin
      const hasActiveSubscription = !!subscription;
      const isPro = role === 'pro' || hasActiveSubscription || role === 'admin';
      const isCoach = role === 'coach' || role === 'admin';
      const isAdmin = role === 'admin';

      console.log('useRole - Final calculations:', { 
        role, 
        hasActiveSubscription, 
        isPro, 
        isCoach, 
        isAdmin,
        aiGenerations: profile.ai_generations_remaining 
      });

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
    staleTime: 1000 * 10, // 10 seconds - refresh frequently to catch updates
    refetchInterval: 3000, // Poll every 3 seconds to catch updates quickly
  });

  return {
    ...roleData,
    isLoading,
    refetch,
  };
};
