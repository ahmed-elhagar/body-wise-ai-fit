import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Users, Calendar } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Pro = () => {
  const { isPro, role, refetch: refetchRole } = useRole();
  const { subscription, createCheckoutSession, cancelSubscription, isCreatingCheckout, isCancelling, refetch: refetchSubscription } = useSubscription();
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Handle successful subscription
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      console.log('Pro page - Subscription success detected, refreshing data');
      toast.success('Welcome to FitGenius Pro! Your subscription is now active.');
      
      // Force refresh both role and subscription data multiple times
      const refreshData = async () => {
        console.log('Pro page - Starting data refresh sequence');
        
        // Initial refresh
        await Promise.all([refetchRole(), refetchSubscription()]);
        
        // Wait 2 seconds and refresh again
        setTimeout(async () => {
          console.log('Pro page - Second refresh attempt');
          await Promise.all([refetchRole(), refetchSubscription()]);
        }, 2000);
        
        // Wait 5 seconds and refresh again
        setTimeout(async () => {
          console.log('Pro page - Third refresh attempt');
          await Promise.all([refetchRole(), refetchSubscription()]);
        }, 5000);
        
        // Wait 10 seconds and refresh again
        setTimeout(async () => {
          console.log('Pro page - Fourth refresh attempt');
          await Promise.all([refetchRole(), refetchSubscription()]);
        }, 10000);
      };
      
      refreshData();
      
      // Remove the URL parameter
      window.history.replaceState({}, '', '/pro');
    } else if (subscriptionStatus === 'cancelled') {
      toast.info('Subscription cancelled. You can try again anytime.');
      window.history.replaceState({}, '', '/pro');
    }
  }, [searchParams, refetchRole, refetchSubscription]);

  // Enhanced debug data collection
  useEffect(() => {
    const collectDebugInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log('Pro page - Current user:', user.id, user.email);
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Pro page - Profile fetch error:', profileError);
          } else {
            console.log('Pro page - Profile data:', profile);
          }

          const { data: subscriptionData, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id);

          if (subError) {
            console.error('Pro page - Subscription fetch error:', subError);
          } else {
            console.log('Pro page - Raw subscription data:', subscriptionData);
          }

          // Check for active subscriptions specifically
          const { data: activeSubscriptions, error: activeSubError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .gte('current_period_end', new Date().toISOString());

          if (activeSubError) {
            console.error('Pro page - Active subscription fetch error:', activeSubError);
          } else {
            console.log('Pro page - Active subscriptions:', activeSubscriptions);
          }

          setDebugInfo({
            userId: user.id,
            email: user.email,
            profile,
            profileError,
            subscriptions: subscriptionData,
            subscriptionError: subError,
            activeSubscriptions,
            activeSubscriptionError: activeSubError,
            currentState: { isPro, role, subscription },
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Debug info collection failed:', error);
        setDebugInfo({ error: error.message, timestamp: new Date().toISOString() });
      }
    };

    collectDebugInfo();
    
    // Refresh debug info every 5 seconds
    const interval = setInterval(collectDebugInfo, 5000);
    return () => clearInterval(interval);
  }, [isPro, role, subscription]);

  // Debug logging
  useEffect(() => {
    console.log('Pro page - Current state changed:', { 
      isPro, 
      role, 
      subscription: subscription ? {
        id: subscription.id,
        status: subscription.status,
        user_id: subscription.user_id,
        stripe_subscription_id: subscription.stripe_subscription_id
      } : null,
      timestamp: new Date().toISOString()
    });
  }, [isPro, role, subscription]);

  const features = [
    { icon: Zap, title: "Unlimited AI Generations", description: "No limits on meal plans and exercise programs" },
    { icon: Users, title: "Priority Support", description: "Get help faster with dedicated support" },
    { icon: Calendar, title: "Advanced Planning", description: "Extended meal plan customization options" },
    { icon: Star, title: "Exclusive Features", description: "Access to beta features and premium content" },
  ];

  const forceRefresh = async () => {
    console.log('Pro page - Manual refresh triggered at:', new Date().toISOString());
    toast.info('Refreshing subscription status...');
    
    try {
      // Force refresh both hooks
      await Promise.all([refetchRole(), refetchSubscription()]);
      
      // Additional manual check
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: freshProfile } = await supabase
          .from('profiles')
          .select('role, ai_generations_remaining')
          .eq('id', user.id)
          .single();
          
        const { data: freshSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
          
        console.log('Pro page - Fresh data after manual refresh:', {
          profile: freshProfile,
          subscription: freshSub,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Pro page - Manual refresh error:', error);
      toast.error('Failed to refresh data');
    }
  };

  if (isPro) {
    return (
      <ProtectedRoute requireProfile>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-8 h-8 text-yellow-500" />
                <h1 className="text-4xl font-bold text-gray-900">FitGenius Pro</h1>
                <Badge className="bg-yellow-500 text-white">ACTIVE</Badge>
              </div>
              <p className="text-gray-600 text-lg">You're enjoying all Pro benefits!</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={forceRefresh}
                className="mt-2"
              >
                Refresh Status
              </Button>
            </div>

            {/* Enhanced Debug Information */}
            {debugInfo && (
              <Card className="mb-8 bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-sm text-yellow-800">🐛 Debug Information (Pro User)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-mono space-y-2 text-yellow-900">
                    <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
                    <p><strong>User ID:</strong> {debugInfo.userId}</p>
                    <p><strong>Email:</strong> {debugInfo.email}</p>
                    <p><strong>Profile Role:</strong> {debugInfo.profile?.role || 'N/A'}</p>
                    <p><strong>AI Generations:</strong> {debugInfo.profile?.ai_generations_remaining || 'N/A'}</p>
                    <p><strong>Is Pro (calculated):</strong> {isPro ? 'Yes' : 'No'}</p>
                    <p><strong>Role (from hook):</strong> {role || 'N/A'}</p>
                    <p><strong>Total Subscriptions:</strong> {debugInfo.subscriptions?.length || 0}</p>
                    <p><strong>Active Subscriptions:</strong> {debugInfo.activeSubscriptions?.length || 0}</p>
                    {debugInfo.activeSubscriptions?.[0] && (
                      <div className="mt-2 p-2 bg-yellow-100 rounded">
                        <p><strong>Active Sub ID:</strong> {debugInfo.activeSubscriptions[0].id}</p>
                        <p><strong>Stripe Sub ID:</strong> {debugInfo.activeSubscriptions[0].stripe_subscription_id}</p>
                        <p><strong>Status:</strong> {debugInfo.activeSubscriptions[0].status}</p>
                        <p><strong>Period End:</strong> {debugInfo.activeSubscriptions[0].current_period_end}</p>
                        <p><strong>Plan Type:</strong> {debugInfo.activeSubscriptions[0].plan_type}</p>
                      </div>
                    )}
                    {debugInfo.error && (
                      <p className="text-red-600"><strong>Error:</strong> {debugInfo.error}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {subscription && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Subscription Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="font-semibold capitalize">{subscription.plan_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Next Billing</p>
                      <p className="font-semibold">
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {subscription.status === 'active' && (
                    <div className="mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => cancelSubscription()}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <feature.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                        <CheckCircle className="w-5 h-5 text-green-500 mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Upgrade to <span className="text-blue-600">FitGenius Pro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock unlimited AI-powered meal planning and exercise programs. Take your fitness journey to the next level.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={forceRefresh}
              >
                Refresh Status
              </Button>
            </div>
          </div>

          {/* Enhanced Debug Information for non-pro users */}
          {debugInfo && (
            <Card className="mb-8 bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-sm text-red-800">🐛 Debug Information (Non-Pro User)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs font-mono space-y-2 text-red-900">
                  <p><strong>Timestamp:</strong> {debugInfo.timestamp}</p>
                  <p><strong>User ID:</strong> {debugInfo.userId}</p>
                  <p><strong>Email:</strong> {debugInfo.email}</p>
                  <p><strong>Profile Role:</strong> {debugInfo.profile?.role || 'N/A'}</p>
                  <p><strong>AI Generations:</strong> {debugInfo.profile?.ai_generations_remaining || 'N/A'}</p>
                  <p><strong>Is Pro (calculated):</strong> {isPro ? 'Yes' : 'No'}</p>
                  <p><strong>Role (from hook):</strong> {role || 'N/A'}</p>
                  <p><strong>Total Subscriptions:</strong> {debugInfo.subscriptions?.length || 0}</p>
                  <p><strong>Active Subscriptions:</strong> {debugInfo.activeSubscriptions?.length || 0}</p>
                  {debugInfo.subscriptions?.[0] && (
                    <div className="mt-2 p-2 bg-red-100 rounded">
                      <p><strong>Latest Sub ID:</strong> {debugInfo.subscriptions[0].id}</p>
                      <p><strong>Stripe Sub ID:</strong> {debugInfo.subscriptions[0].stripe_subscription_id}</p>
                      <p><strong>Status:</strong> {debugInfo.subscriptions[0].status}</p>
                      <p><strong>Period End:</strong> {debugInfo.subscriptions[0].current_period_end}</p>
                      <p><strong>Plan Type:</strong> {debugInfo.subscriptions[0].plan_type}</p>
                      <p><strong>Created:</strong> {debugInfo.subscriptions[0].created_at}</p>
                      <p><strong>Updated:</strong> {debugInfo.subscriptions[0].updated_at}</p>
                    </div>
                  )}
                  {debugInfo.error && (
                    <p className="text-red-600"><strong>Error:</strong> {debugInfo.error}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Monthly Plan */}
            <Card className="relative bg-white shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">Monthly</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$19</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mb-6 bg-blue-600 hover:bg-blue-700" 
                  size="lg"
                  onClick={() => createCheckoutSession({ planType: 'monthly' })}
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? 'Creating...' : 'Start Monthly Plan'}
                </Button>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature.title}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="relative bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-yellow-500 text-black font-semibold px-4 py-1">
                  BEST VALUE - Save 37%
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-center">Yearly</CardTitle>
                <div className="text-center">
                  <span className="text-4xl font-bold">$144</span>
                  <span className="text-blue-100">/year</span>
                </div>
                <p className="text-center text-blue-100">Just $12/month</p>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mb-6 bg-white text-blue-600 hover:bg-gray-100" 
                  size="lg"
                  onClick={() => createCheckoutSession({ planType: 'yearly' })}
                  disabled={isCreatingCheckout}
                >
                  {isCreatingCheckout ? 'Creating...' : 'Start Yearly Plan'}
                </Button>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-blue-100">{feature.title}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="text-blue-100 font-semibold">Save $84 per year</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-gray-600">
            <p>✨ 7-day money-back guarantee • Cancel anytime • Secure payment with Stripe</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Pro;
