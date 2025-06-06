
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Users, Zap, Target } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Plans",
      description: "AI-powered meal and exercise plans tailored to your goals"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Tracking",
      description: "Advanced food recognition and workout tracking"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Coaching",
      description: "Professional coaches to guide your journey"
    }
  ];

  const benefits = [
    "Personalized AI meal plans",
    "Custom workout programs",
    "Progress tracking & analytics",
    "Expert coach support",
    "Food photo analysis",
    "24/7 AI assistance"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-fitness-gradient rounded-lg"></div>
          <span className="text-xl font-bold bg-fitness-gradient bg-clip-text text-transparent">
            FitGenius
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            className="bg-fitness-gradient hover:opacity-90"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <span className="block bg-fitness-gradient bg-clip-text text-transparent">
              Fitness Companion
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized meal plans, workout routines, and expert coaching powered by advanced AI. 
            Transform your health journey with intelligent recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-fitness-gradient hover:opacity-90 text-lg px-8 py-3"
            >
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-3"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FitGenius?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of fitness with our AI-powered platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-fitness-gradient rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Everything You Need to Succeed
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Card className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 font-semibold">4.9/5</span>
              </div>
              <p className="text-lg mb-4">
                "FitGenius transformed my fitness journey. The AI recommendations are spot-on!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm opacity-90">Fitness Enthusiast</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have achieved their fitness goals with FitGenius
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Get Started Free
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-fitness-gradient rounded"></div>
            <span className="font-semibold">FitGenius</span>
          </div>
          <p className="text-gray-600 text-sm">
            © 2024 FitGenius. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
