
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, Calendar, User, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";

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
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const SubscriptionsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { adminCancelSubscription, isAdminCancelling } = useSubscription();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      console.log('Fetching subscriptions...');
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles!subscriptions_user_id_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }
      
      console.log('Raw subscriptions data:', data);
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        profiles: item.profiles || { first_name: '', last_name: '', email: '' }
      })) as Subscription[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get revenue analytics
  const { data: analytics } = useQuery({
    queryKey: ['subscription-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_type, status, created_at, current_period_end')
        .eq('status', 'active');

      if (error) throw error;

      const monthlyRevenue = (data || [])
        .filter(sub => sub.plan_type === 'monthly')
        .length * 9.99;
      
      const yearlyRevenue = (data || [])
        .filter(sub => sub.plan_type === 'yearly')
        .length * 99.99;

      const totalMRR = monthlyRevenue + (yearlyRevenue / 12);
      
      return {
        totalMRR,
        monthlyRevenue,
        yearlyRevenue,
        activeSubscriptions: data?.length || 0
      };
    }
  });

  const handleCancelSubscription = async (targetUserId: string) => {
    try {
      await adminCancelSubscription({ targetUserId });
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const filteredSubscriptions = subscriptions?.filter(sub =>
    sub.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.profiles.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.profiles.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      case 'past_due': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'trialing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'canceled': return AlertTriangle;
      case 'past_due': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Revenue Analytics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Subscription Management</h2>
              <p className="text-gray-600">Monitor revenue and manage user subscriptions</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Monthly Recurring Revenue</span>
              </div>
              <p className="text-2xl font-bold text-green-600">${analytics?.totalMRR?.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Active Subscriptions</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{subscriptions?.filter(s => s.status === 'active').length || 0}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-600">Cancelled</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{subscriptions?.filter(s => s.status === 'canceled').length || 0}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Total Subscriptions</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{subscriptions?.length || 0}</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by email, name, or plan type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Period</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => {
                  const StatusIcon = getStatusIcon(subscription.status);
                  const revenue = subscription.plan_type === 'monthly' ? 9.99 : 
                                 subscription.plan_type === 'yearly' ? 99.99 : 0;
                  
                  return (
                    <tr key={subscription.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {subscription.profiles.first_name} {subscription.profiles.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{subscription.profiles.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize font-medium">
                          {subscription.plan_type || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${getStatusColor(subscription.status)} flex items-center gap-1 w-fit`}>
                          <StatusIcon className="w-3 h-3" />
                          {subscription.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {subscription.current_period_end ? 
                              new Date(subscription.current_period_end).toLocaleDateString() : 
                              'N/A'
                            }
                          </p>
                          <p className="text-gray-500">
                            {subscription.cancel_at_period_end ? 'Cancels at end' : 'Auto-renew'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-green-600">${revenue}</p>
                      </td>
                      <td className="px-6 py-4">
                        {subscription.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelSubscription(subscription.user_id)}
                            disabled={isAdminCancelling}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            {isAdminCancelling ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Subscriptions Found</h3>
              <p>
                {searchTerm ? 'No subscriptions match your search criteria.' : 'No subscription records found in the database.'}
              </p>
              {!searchTerm && subscriptions?.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  Subscriptions will appear here once users purchase plans.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;
