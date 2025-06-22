
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type TimeRange = '7d' | '30d' | '90d';

const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
      }

      // Get subscription analytics
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('created_at, status, plan_type')
        .gte('created_at', startDate.toISOString());

      if (subError) throw subError;

      // Get cancellation analytics
      const { data: cancellations, error: cancelError } = await supabase
        .from('subscriptions')
        .select('updated_at, status')
        .eq('status', 'cancelled')
        .gte('updated_at', startDate.toISOString());

      if (cancelError) throw cancelError;

      // Process data for charts
      const dailyUpgrades: Record<string, number> = {};
      const dailyCancellations: Record<string, number> = {};
      const planTypes: Record<string, number> = {};

      // Initialize date range
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        dailyUpgrades[dateKey] = 0;
        dailyCancellations[dateKey] = 0;
      }

      // Count upgrades by day
      subscriptions?.forEach(sub => {
        const dateKey = sub.created_at.split('T')[0];
        if (dailyUpgrades[dateKey] !== undefined) {
          dailyUpgrades[dateKey]++;
        }
        planTypes[sub.plan_type] = (planTypes[sub.plan_type] || 0) + 1;
      });

      // Count cancellations by day
      cancellations?.forEach(cancel => {
        const dateKey = cancel.updated_at.split('T')[0];
        if (dailyCancellations[dateKey] !== undefined) {
          dailyCancellations[dateKey]++;
        }
      });

      // Format for chart
      const chartData = Object.keys(dailyUpgrades).map(date => ({
        date,
        upgrades: dailyUpgrades[date],
        cancellations: dailyCancellations[date],
        net: dailyUpgrades[date] - dailyCancellations[date]
      }));

      const planData = Object.entries(planTypes).map(([plan, count]) => ({
        plan,
        count
      }));

      return {
        chartData,
        planData,
        totalUpgrades: subscriptions?.length || 0,
        totalCancellations: cancellations?.length || 0,
        conversionRate: subscriptions?.length ? 
          ((subscriptions.length - (cancellations?.length || 0)) / subscriptions.length * 100) : 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Subscription Analytics
            </CardTitle>
            <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Upgrades</p>
                <p className="text-2xl font-bold text-green-600">
                  {analyticsData?.totalUpgrades || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Cancellations</p>
                <p className="text-2xl font-bold text-red-600">
                  {analyticsData?.totalCancellations || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Net Growth</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(analyticsData?.totalUpgrades || 0) - (analyticsData?.totalCancellations || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Retention Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsData?.conversionRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Upgrades/Cancellations */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Subscription Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="upgrades" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Upgrades"
                />
                <Line 
                  type="monotone" 
                  dataKey="cancellations" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Cancellations"
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Net Growth"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.planData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
