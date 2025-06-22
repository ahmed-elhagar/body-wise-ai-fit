import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/analytics';

interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  status: string;
  plan_type: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_price_id: string;
  interval: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading, refetch } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      console.log('useSubscription - Fetching subscription for user:', user.id);

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('useSubscription - Error:', error);
        throw error;
      }

      console.log('useSubscription - Fetched subscription:', data);
      return data as Subscription | null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  // Enhanced subscription status check
  const isProMember = () => {
    if (!subscription) return false;
    
    const isActive = subscription.status === 'active';
    const notExpired = new Date(subscription.current_period_end) > new Date();
    const notCancelled = !subscription.cancel_at_period_end;
    
    return isActive && notExpired && notCancelled;
  };

  const createCheckoutSession = useMutation({
    mutationFn: async ({ planType }: { planType: 'monthly' | 'yearly' }) => {
      console.log('useSubscription - Creating checkout session for:', planType);
      
      // Track upgrade clicked event
      if (user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        trackEvent('upgrade_clicked', {
          plan_type: planType,
          user_role: profile?.role || 'normal'
        });
      }
      
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { plan_type: planType }
      });

      if (error) {
        console.error('useSubscription - Checkout error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        console.log('useSubscription - Opening checkout URL:', data.url);
        window.open(data.url, '_blank');
        
        // Enhanced polling for subscription updates
        const pollInterval = setInterval(() => {
          console.log('useSubscription - Polling for subscription updates');
          refetch();
          queryClient.invalidateQueries({ queryKey: ['user-role'] });
          queryClient.invalidateQueries({ queryKey: ['subscription'] });
        }, 5000); // Poll every 5 seconds
        
        // Stop polling after 2 minutes
        setTimeout(() => {
          console.log('useSubscription - Stopping polling');
          clearInterval(pollInterval);
        }, 120000);
      }
    },
    onError: (error) => {
      console.error('useSubscription - Create checkout session error:', error);
      toast.error(`Failed to create checkout session: ${error.message}`);
    }
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      // Track cancellation event
      if (user?.id && subscription) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
          
        trackEvent('cancel_subscription', {
          plan_type: subscription.plan_type,
          user_id: user.id,
          user_role: profile?.role || 'normal'
        });
      }
      
      const { data, error } = await supabase.functions.invoke('cancel-subscription');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['user-role'] });
      toast.success(data.message || 'Subscription cancelled successfully');
    },
    onError: (error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    }
  });

  const adminCancelSubscription = useMutation({
    mutationFn: async ({ targetUserId, refund }: { targetUserId: string; refund?: boolean }) => {
      const { data, error } = await supabase.functions.invoke('admin-cancel-subscription', {
        body: { target_user_id: targetUserId, refund: refund }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success(data.message || 'Subscription cancelled successfully');
    },
    onError: (error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    }
  });

  return {
    subscription,
    isLoading,
    refetch,
    isProMember: isProMember(),
    createCheckoutSession: createCheckoutSession.mutate,
    cancelSubscription: cancelSubscription.mutate,
    adminCancelSubscription: adminCancelSubscription.mutate,
    isCreatingCheckout: createCheckoutSession.isPending,
    isCancelling: cancelSubscription.isPending,
    isAdminCancelling: adminCancelSubscription.isPending,
  };
};
