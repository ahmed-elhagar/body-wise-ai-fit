
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, RefreshCw } from 'lucide-react';

interface DebugData {
  timestamp: string;
  userProfile: any;
  subscriptions: any[];
  activeSubscriptions: any[];
  stripeCustomer: any;
  webhookLogs: any[];
  roleData: any;
  error?: string;
}

export const SubscriptionDebugPanel = () => {
  const { user } = useAuth();
  const [debugData, setDebugData] = useState<DebugData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const collectDebugData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const timestamp = new Date().toISOString();
      
      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Get all subscriptions
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Get active subscriptions
      const { data: activeSubscriptions, error: activeSubError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString());

      // Get AI generation logs (recent)
      const { data: webhookLogs, error: logsError } = await supabase
        .from('ai_generation_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const debugData: DebugData = {
        timestamp,
        userProfile: profileError ? { error: profileError } : userProfile,
        subscriptions: subError ? [] : (subscriptions || []),
        activeSubscriptions: activeSubError ? [] : (activeSubscriptions || []),
        stripeCustomer: null, // We'll add this if needed
        webhookLogs: logsError ? [] : (webhookLogs || []),
        roleData: {
          // Add role-related data here
        }
      };

      setDebugData(debugData);
      console.log('Debug Data Collected:', debugData);
    } catch (error) {
      console.error('Error collecting debug data:', error);
      setDebugData({
        timestamp: new Date().toISOString(),
        userProfile: null,
        subscriptions: [],
        activeSubscriptions: [],
        stripeCustomer: null,
        webhookLogs: [],
        roleData: null,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWebhookFlow = async () => {
    try {
      console.log('Testing webhook flow...');
      // This would trigger a test webhook if we had that functionality
      // For now, we'll just refresh the data
      await collectDebugData();
    } catch (error) {
      console.error('Error testing webhook flow:', error);
    }
  };

  useEffect(() => {
    if (user) {
      collectDebugData();
      // Auto-refresh every 10 seconds
      const interval = setInterval(collectDebugData, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) return null;

  return (
    <Card className="mt-4 border-blue-200 bg-blue-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-blue-100 transition-colors">
            <CardTitle className="text-sm flex items-center justify-between text-blue-800">
              🔧 Subscription Debug Panel (Live)
              <div className="flex items-center gap-2">
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={collectDebugData}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={testWebhookFlow}
              >
                Test Webhook Flow
              </Button>
            </div>

            {debugData && (
              <div className="text-xs space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">User Profile</h4>
                    <div className="bg-white p-2 rounded border">
                      <p><strong>ID:</strong> {user.id}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Role:</strong> {debugData.userProfile?.role || 'N/A'}</p>
                      <p><strong>AI Generations:</strong> {debugData.userProfile?.ai_generations_remaining || 'N/A'}</p>
                      <p><strong>Pro Status:</strong> 
                        <Badge variant={debugData.userProfile?.role === 'pro' ? 'default' : 'secondary'}>
                          {debugData.userProfile?.role === 'pro' ? 'PRO' : 'NORMAL'}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Subscriptions</h4>
                    <div className="bg-white p-2 rounded border">
                      <p><strong>Total:</strong> {debugData.subscriptions.length}</p>
                      <p><strong>Active:</strong> {debugData.activeSubscriptions.length}</p>
                      {debugData.subscriptions.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium">Latest Subscription:</p>
                          <p><strong>Status:</strong> {debugData.subscriptions[0]?.status}</p>
                          <p><strong>Plan:</strong> {debugData.subscriptions[0]?.plan_type}</p>
                          <p><strong>Stripe ID:</strong> {debugData.subscriptions[0]?.stripe_subscription_id || 'None'}</p>
                          <p><strong>Period End:</strong> {debugData.subscriptions[0]?.current_period_end ? new Date(debugData.subscriptions[0].current_period_end).toLocaleString() : 'N/A'}</p>
                          <p><strong>Created:</strong> {debugData.subscriptions[0]?.created_at ? new Date(debugData.subscriptions[0].created_at).toLocaleString() : 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Diagnosis</h4>
                  <div className="bg-white p-2 rounded border">
                    {debugData.subscriptions.length === 0 && (
                      <p className="text-red-600">❌ No subscription records found in database</p>
                    )}
                    {debugData.subscriptions.length > 0 && debugData.subscriptions[0]?.status !== 'active' && (
                      <p className="text-orange-600">⚠️ Subscription exists but status is: {debugData.subscriptions[0]?.status}</p>
                    )}
                    {debugData.subscriptions.length > 0 && debugData.subscriptions[0]?.status === 'active' && !debugData.subscriptions[0]?.stripe_subscription_id && (
                      <p className="text-orange-600">⚠️ Active subscription but no Stripe ID - webhook may not have processed</p>
                    )}
                    {debugData.activeSubscriptions.length > 0 && debugData.userProfile?.role !== 'pro' && (
                      <p className="text-red-600">❌ Active subscription exists but user role is not 'pro'</p>
                    )}
                    {debugData.activeSubscriptions.length > 0 && debugData.userProfile?.role === 'pro' && (
                      <p className="text-green-600">✅ Everything looks correct - user has active subscription and pro role</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Raw Data (Last Updated: {new Date(debugData.timestamp).toLocaleTimeString()})</h4>
                  <details className="bg-white p-2 rounded border">
                    <summary className="cursor-pointer font-medium">View Raw JSON Data</summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-48">
                      {JSON.stringify(debugData, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
