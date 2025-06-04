import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Database, 
  Server, 
  Shield, 
  Bell,
  Users,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Activity,
  Globe,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import SystemHealthMonitor from './SystemHealthMonitor';
import UserGenerationManager from './UserGenerationManager';
import { FeatureFlagToggle } from './FeatureFlagToggle';

interface SystemSettings {
  maintenance_mode: boolean;
  user_registration: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  ai_features: boolean;
  subscription_required: boolean;
}

const EnhancedSystemTab = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const queryClient = useQueryClient();

  // System stats query
  const { data: systemStats, isLoading: statsLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalGenerations },
        { count: activeSubscriptions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('active_sessions').select('*', { count: 'exact', head: true }).gte('last_activity', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('ai_generation_logs').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
      ]);

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalGenerations: totalGenerations || 0,
        activeSubscriptions: activeSubscriptions || 0
      };
    },
    refetchInterval: 30000
  });

  // Database health check
  const { data: dbHealth } = useQuery({
    queryKey: ['database-health'],
    queryFn: async () => {
      const startTime = Date.now();
      try {
        await supabase.from('profiles').select('id').limit(1);
        const responseTime = Date.now() - startTime;
        return {
          status: 'healthy',
          responseTime,
          connected: true
        };
      } catch (error) {
        return {
          status: 'error',
          responseTime: Date.now() - startTime,
          connected: false,
          error: error.message
        };
      }
    },
    refetchInterval: 60000
  });

  // Clear cache mutation
  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      // Clear React Query cache
      queryClient.clear();
      // Could also clear other caches here
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Cache cleared successfully');
    },
    onError: () => {
      toast.error('Failed to clear cache');
    }
  });

  // Force logout all users
  const forceLogoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('force_logout_all_users');
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success('All users logged out successfully');
      queryClient.invalidateQueries({ queryKey: ['system-stats'] });
    },
    onError: (error) => {
      toast.error(`Failed to logout users: ${error.message}`);
    }
  });

  // Cleanup old sessions
  const cleanupSessionsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('cleanup_old_sessions');
      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      toast.success('Old sessions cleaned up successfully');
      queryClient.invalidateQueries({ queryKey: ['system-stats'] });
    },
    onError: (error) => {
      toast.error(`Failed to cleanup sessions: ${error.message}`);
    }
  });

  const systemFeatures = [
    {
      id: 'user_registration',
      label: 'User Registration',
      description: 'Allow new users to register',
      icon: Users,
      enabled: true
    },
    {
      id: 'email_notifications',
      label: 'Email Notifications',
      description: 'Send email notifications to users',
      icon: Mail,
      enabled: true
    },
    {
      id: 'push_notifications',
      label: 'Push Notifications',
      description: 'Send push notifications to mobile users',
      icon: Smartphone,
      enabled: false
    },
    {
      id: 'ai_features',
      label: 'AI Features',
      description: 'Enable AI-powered meal and exercise planning',
      icon: Activity,
      enabled: true
    },
    {
      id: 'subscription_required',
      label: 'Subscription Required',
      description: 'Require subscription for premium features',
      icon: Lock,
      enabled: true
    },
    {
      id: 'maintenance_mode',
      label: 'Maintenance Mode',
      description: 'Put the system in maintenance mode',
      icon: Settings,
      enabled: maintenanceMode
    }
  ];

  return (
    <div className="space-y-6">
      {/* System Overview Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">System Administration</h2>
              <p className="text-gray-600">Monitor system health and manage configurations</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{systemStats?.totalUsers || 0}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Active Users (24h)</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{systemStats?.activeUsers || 0}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">AI Generations</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{systemStats?.totalGenerations || 0}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-white/40">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Active Subscriptions</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{systemStats?.activeSubscriptions || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            System Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => clearCacheMutation.mutate()}
              disabled={clearCacheMutation.isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {clearCacheMutation.isPending ? 'Clearing...' : 'Clear Cache'}
            </Button>
            
            <Button
              onClick={() => cleanupSessionsMutation.mutate()}
              disabled={cleanupSessionsMutation.isPending}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {cleanupSessionsMutation.isPending ? 'Cleaning...' : 'Cleanup Old Sessions'}
            </Button>
            
            <Button
              onClick={() => forceLogoutMutation.mutate()}
              disabled={forceLogoutMutation.isPending}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {forceLogoutMutation.isPending ? 'Logging out...' : 'Force Logout All'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            System Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{feature.label}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={feature.enabled ? 'default' : 'secondary'}>
                      {feature.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) => {
                        if (feature.id === 'maintenance_mode') {
                          setMaintenanceMode(checked);
                        }
                        // Handle other feature toggles here
                        toast.info(`${feature.label} ${checked ? 'enabled' : 'disabled'}`);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${dbHealth?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <h3 className="font-medium text-gray-900">Database Connection</h3>
                <p className="text-sm text-gray-600">
                  Response time: {dbHealth?.responseTime}ms
                </p>
              </div>
            </div>
            <Badge variant={dbHealth?.connected ? 'default' : 'destructive'}>
              {dbHealth?.status || 'Unknown'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Existing components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FeatureFlagToggle />
          <SystemHealthMonitor />
        </div>
        <UserGenerationManager />
      </div>
    </div>
  );
};

export default EnhancedSystemTab;
