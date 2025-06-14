import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Users, Calendar } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useSubscription } from "@/hooks/useSubscription";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { SubscriptionDebugPanel } from "@/components/SubscriptionDebugPanel";

const Pro = () => {
  const { isPro, role, refetch: refetchRole } = useRole();
  const { subscription, createCheckoutSession, cancelSubscription, isCreatingCheckout, isCancelling, refetch: refetchSubscription } = useSubscription();
  const [searchParams] = useSearchParams();

  // Handle successful subscription
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      console.log('Pro page - Subscription success detected, refreshing data');
      toast.success('Welcome to FitFatta Pro! Your subscription is now active.');
      
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
      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Pro page - Manual refresh error:', error);
      toast.error('Failed to refresh data');
    }
  };

  if (isPro) {
    return (
      <ProtectedRoute requireProfile>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <h1 className="text-4xl font-bold text-gray-900">FitFatta Pro</h1>
                  <Badge className="bg-yellow-500 text-white" data-testid="user-role-badge">ACTIVE</Badge>
                </div>
                <p className="text-gray-600 text-lg">You're enjoying all Pro benefits!</p>
                <div className="mt-2 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={forceRefresh}
                    className="mt-2"
                  >
                    Refresh Status
                  </Button>
                  <div className="text-sm text-gray-600">
                    AI Generations: <span data-testid="ai-generations-remaining">∞</span>
                  </div>
                </div>
              </div>

              {/* Debug Panel */}
              <SubscriptionDebugPanel />

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
                        <Badge 
                          variant={subscription.status === 'active' ? 'default' : 'secondary'}
                          data-testid="subscription-status"
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Next Billing</p>
                        <p className="font-semibold">
                          {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {subscription.status === 'active' && (
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => cancelSubscription()}
                          disabled={isCancelling}
                          data-testid="manage-subscription-button"
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
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireProfile>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Upgrade to <span className="text-blue-600">FitFatta Pro</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlock unlimited AI-powered meal planning and exercise programs. Take your fitness journey to the next level.
              </p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <Badge variant="secondary" data-testid="user-role-badge">
                  {role?.toUpperCase() || 'NORMAL'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={forceRefresh}
                >
                  Refresh Status
                </Button>
                <div className="text-sm text-gray-600">
                  AI Generations: <span data-testid="ai-generations-remaining">5</span>
                </div>
              </div>
            </div>

            {/* Debug Panel for Non-Pro Users */}
            <SubscriptionDebugPanel />

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
                    data-testid="monthly-plan-button"
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
                    data-testid="yearly-plan-button"
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
      </Layout>
    </ProtectedRoute>
  );
};

export default Pro;
