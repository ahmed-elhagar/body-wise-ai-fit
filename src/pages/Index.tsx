
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Dumbbell, 
  Users, 
  Target, 
  Brain, 
  TrendingUp, 
  Heart,
  ArrowRight,
  Sparkles,
  Shield,
  Zap
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Plans",
      description: "Get personalized meal and exercise plans tailored to your goals and preferences"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Track your progress with detailed analytics and achieve your fitness objectives"
    },
    {
      icon: Heart,
      title: "Health Focused",
      description: "Comprehensive health monitoring including weight, body composition, and wellness"
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with fitness enthusiasts worldwide and share your journey"
    }
  ];

  const benefits = [
    { icon: Sparkles, text: "Personalized AI recommendations" },
    { icon: Shield, text: "Secure data protection" },
    { icon: Zap, text: "Real-time progress tracking" },
    { icon: TrendingUp, text: "Proven results" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-fitness-gradient rounded-full flex items-center justify-center">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-fitness-gradient bg-clip-text text-transparent">
              FitGenius AI
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Your AI-powered fitness companion for personalized meal plans, 
            exercise programs, and wellness tracking
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-fitness-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-2 border-fitness-primary text-fitness-primary hover:bg-fitness-primary hover:text-white px-8 py-4 text-lg font-semibold"
            >
              Learn More
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-gray-600">
                <benefit.icon className="w-5 h-5 text-fitness-primary" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-fitness-gradient rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Transform Your Fitness Journey?
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Join thousands of users who have achieved their fitness goals with FitGenius AI
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-fitness-gradient hover:opacity-90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Start Your Journey Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
