
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Users, Calendar } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useSubscription } from "@/hooks/useSubscription";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const Pro = () => {
  const { isPro, role, refetch: refetchRole } = useRole();
  const { subscription, createCheckoutSession, cancelSubscription, isCreatingCheckout, isCancelling } = useSubscription();
  const [searchParams] = useSearchParams();

  // Handle successful subscription
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      toast.success('Welcome to FitGenius Pro! Your subscription is now active.');
      // Refetch user role and subscription status
      refetchRole();
      // Remove the URL parameter
      window.history.replaceState({}, '', '/pro');
    } else if (subscriptionStatus === 'cancelled') {
      toast.info('Subscription cancelled. You can try again anytime.');
      // Remove the URL parameter
      window.history.replaceState({}, '', '/pro');
    }
  }, [searchParams, refetchRole]);

  const features = [
    { icon: Zap, title: "Unlimited AI Generations", description: "No limits on meal plans and exercise programs" },
    { icon: Users, title: "Priority Support", description: "Get help faster with dedicated support" },
    { icon: Calendar, title: "Advanced Planning", description: "Extended meal plan customization options" },
    { icon: Star, title: "Exclusive Features", description: "Access to beta features and premium content" },
  ];

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
            </div>

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
          </div>

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
