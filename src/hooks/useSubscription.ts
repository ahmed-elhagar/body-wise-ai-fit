
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

  const { data: subscription, isLoading } = useQuery({
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
    refetchInterval: 10000, // Poll every 10 seconds to catch webhook updates
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
    createCheckoutSession: createCheckoutSession.mutate,
    cancelSubscription: cancelSubscription.mutate,
    adminCancelSubscription: adminCancelSubscription.mutate,
    isCreatingCheckout: createCheckoutSession.isPending,
    isCancelling: cancelSubscription.isPending,
    isAdminCancelling: adminCancelSubscription.isPending,
  };
};
