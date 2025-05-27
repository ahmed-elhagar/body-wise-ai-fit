
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Dumbbell, Apple, TrendingUp, Brain, Users, Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-fitness-primary" />,
      title: "AI-Powered Recommendations",
      description: "Get personalized meal plans and exercise routines tailored to your goals and preferences"
    },
    {
      icon: <Apple className="w-8 h-8 text-green-600" />,
      title: "Smart Nutrition Tracking",
      description: "Track calories, macros, and nutrients with our intelligent food recognition system"
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-blue-600" />,
      title: "Custom Workouts",
      description: "Home and gym workouts with YouTube tutorials and progress tracking"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Progress Analytics",
      description: "Visualize your fitness journey with detailed charts and insights"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">FitGenius</span>
          </div>
          <div className="space-x-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-fitness-gradient hover:opacity-90">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth')} className="bg-fitness-gradient hover:opacity-90">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Your AI-Powered
          <span className="bg-fitness-gradient bg-clip-text text-transparent"> Fitness Companion</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform your health journey with personalized nutrition plans, custom workouts, 
          and intelligent progress tracking. Let AI guide you to your fitness goals.
        </p>
        <div className="space-x-4">
          {!user && (
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-fitness-gradient hover:opacity-90 text-lg px-8 py-3"
            >
              Start Your Journey
            </Button>
          )}
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="text-lg px-8 py-3"
          >
            {user ? 'Go to Dashboard' : 'Learn More'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything You Need for Success
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Trusted by Thousands</h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">4.9/5 from 10,000+ users</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Lost 25 lbs in 3 months",
              quote: "FitGenius made fitness simple and sustainable. The AI recommendations were spot-on!"
            },
            {
              name: "Mike Chen",
              role: "Gained 15 lbs muscle",
              quote: "The personalized workout plans and nutrition guidance helped me reach my goals faster."
            },
            {
              name: "Emily Davis",
              role: "Marathon runner",
              quote: "The progress tracking and meal planning features are game-changers for serious athletes."
            }
          ].map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-fitness-gradient border-0 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who've achieved their fitness goals with AI-powered guidance.
          </p>
          {!user && (
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-white text-fitness-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              Start Free Today
            </Button>
          )}
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 FitGenius. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
