
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Subscription | null;
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Poll every 5 seconds to catch webhook updates faster
  });

  const createCheckoutSession = useMutation({
    mutationFn: async ({ planType }: { planType: 'monthly' | 'yearly' }) => {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { plan_type: planType }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        // Start polling more frequently while checkout is in progress
        const pollInterval = setInterval(() => {
          refetch();
          // Refresh role data as well
          queryClient.invalidateQueries({ queryKey: ['user-role'] });
        }, 2000);
        
        // Stop polling after 5 minutes
        setTimeout(() => clearInterval(pollInterval), 300000);
      }
    },
    onError: (error) => {
      toast.error(`Failed to create checkout session: ${error.message}`);
    }
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
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
    createCheckoutSession: createCheckoutSession.mutate,
    cancelSubscription: cancelSubscription.mutate,
    adminCancelSubscription: adminCancelSubscription.mutate,
    isCreatingCheckout: createCheckoutSession.isPending,
    isCancelling: cancelSubscription.isPending,
    isAdminCancelling: adminCancelSubscription.isPending,
  };
};
