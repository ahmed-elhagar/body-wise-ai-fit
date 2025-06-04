
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreditCard, Search, Calendar, User, DollarSign, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  created_at: string;
  updated_at: string;
  user_profile: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const SubscriptionsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading, error } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      console.log('Fetching subscriptions...');
      
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user_profile:profiles!subscriptions_user_id_fkey(
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
        throw subscriptionsError;
      }

      console.log('Fetched subscriptions:', subscriptionsData);
      return subscriptionsData as Subscription[];
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async () => {
      const [
        { count: totalSubscriptions },
        { count: activeSubscriptions },
        { count: cancelledSubscriptions }
      ] = await Promise.all([
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'cancelled')
      ]);

      return {
        total: totalSubscriptions || 0,
        active: activeSubscriptions || 0,
        cancelled: cancelledSubscriptions || 0
      };
    }
  });

  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'cancelled',
          cancel_at_period_end: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    }
  });

  const reactivateSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'active',
          cancel_at_period_end: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-stats'] });
      toast.success('Subscription reactivated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to reactivate subscription: ${error.message}`);
    }
  });

  const filteredSubscriptions = subscriptions?.filter(sub =>
    sub.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.user_profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.user_profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (status === 'active' && !cancelAtPeriodEnd) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (status === 'active' && cancelAtPeriodEnd) {
      return <Badge className="bg-yellow-100 text-yellow-800">Cancelling</Badge>;
    } else if (status === 'cancelled') {
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    } else {
      return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (planType: string) => {
    const colors = {
      monthly: 'bg-blue-100 text-blue-800',
      yearly: 'bg-purple-100 text-purple-800',
      lifetime: 'bg-gold-100 text-gold-800'
    };
    return <Badge className={colors[planType as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{planType}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <CreditCard className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="text-red-600 mb-4">Error loading subscriptions</div>
          <p className="text-gray-500">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Subscription Management</h2>
            <p className="text-gray-600">Monitor and manage user subscriptions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats?.cancelled || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscriptions ({filteredSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscriptions Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No subscriptions match your search criteria.' : 'No subscriptions exist yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription) => (
                <div key={subscription.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {subscription.user_profile?.first_name && subscription.user_profile?.last_name
                            ? `${subscription.user_profile.first_name} ${subscription.user_profile.last_name}`
                            : subscription.user_profile?.email || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">{subscription.user_profile?.email}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(subscription.status, subscription.cancel_at_period_end)}
                          {getPlanBadge(subscription.plan_type)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.current_period_end && (
                            <>Expires: {new Date(subscription.current_period_end).toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {subscription.status === 'active' && !subscription.cancel_at_period_end ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelSubscription.mutate(subscription.id)}
                            disabled={cancelSubscription.isPending}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            Cancel
                          </Button>
                        ) : subscription.status === 'cancelled' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reactivateSubscription.mutate(subscription.id)}
                            disabled={reactivateSubscription.isPending}
                            className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                          >
                            Reactivate
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span> {new Date(subscription.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Interval:</span> {subscription.interval}
                    </div>
                    <div>
                      <span className="font-medium">Stripe ID:</span> {subscription.stripe_subscription_id?.substring(0, 20)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;
