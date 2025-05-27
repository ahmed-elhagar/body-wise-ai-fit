
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { 
  Dumbbell, 
  Target, 
  Brain, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized meal plans and workout routines tailored to your goals and preferences."
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track your fitness goals with detailed progress monitoring and analytics."
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your journey with comprehensive charts and insights about your fitness progress."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Plan your workouts and meals with intelligent scheduling that adapts to your lifestyle."
    }
  ];

  const benefits = [
    "Personalized nutrition based on your body type and goals",
    "Custom workout plans for home, gym, or outdoor activities",
    "Real-time progress tracking and analytics",
    "AI-powered meal and exercise recommendations",
    "Comprehensive health and fitness monitoring"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">FitGenius</h1>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-fitness-gradient hover:opacity-90 text-white"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Your AI Fitness
            <span className="bg-fitness-gradient bg-clip-text text-transparent"> Companion</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your fitness journey with personalized AI-powered meal plans, workout routines, 
            and progress tracking. Achieve your goals faster with intelligent recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-fitness-gradient hover:opacity-90 text-white px-8 py-4 text-lg"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="px-8 py-4 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Everything you need for your fitness journey
            </h2>
            <p className="text-gray-600 mb-8">
              FitGenius combines the power of artificial intelligence with proven fitness science 
              to create a completely personalized experience that adapts to your unique needs and goals.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gradient-to-br from-fitness-primary to-fitness-secondary rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <Users className="w-24 h-24 mx-auto mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Join Thousands</h3>
                <p className="opacity-90">Who've transformed their lives</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-12 text-center bg-fitness-gradient text-white border-0 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your fitness journey?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join FitGenius today and get your personalized AI fitness plan in minutes.
          </p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="bg-white text-fitness-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
