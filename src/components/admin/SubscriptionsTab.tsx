
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, DollarSign, Calendar, User } from "lucide-react";
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
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const SubscriptionsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles!subscriptions_user_id_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        ...item,
        profiles: item.profiles || { first_name: '', last_name: '', email: '' }
      })) as Subscription[];
    }
  });

  const cancelSubscription = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data, error } = await supabase.functions.invoke('admin-cancel-subscription', {
        body: { subscription_id: subscriptionId }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error) => {
      toast.error(`Failed to cancel subscription: ${error.message}`);
    }
  });

  const filteredSubscriptions = subscriptions?.filter(sub =>
    sub.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.profiles.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.profiles.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {subscriptions?.filter(s => s.status === 'active').length || 0}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {subscriptions?.filter(s => s.status === 'canceled').length || 0}
              </p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {subscriptions?.filter(s => s.status === 'past_due').length || 0}
              </p>
              <p className="text-sm text-gray-600">Past Due</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {subscriptions?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Period End</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {subscription.profiles.first_name} {subscription.profiles.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{subscription.profiles.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="capitalize">
                        {subscription.plan_type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {subscription.status === 'active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelSubscription.mutate(subscription.stripe_subscription_id)}
                          disabled={cancelSubscription.isPending}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No subscriptions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsTab;
