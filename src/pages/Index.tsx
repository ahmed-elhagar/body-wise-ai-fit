
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Activity, Brain, Target, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-fitness-primary" />,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations based on your unique profile and goals"
    },
    {
      icon: <Target className="w-8 h-8 text-fitness-secondary" />,
      title: "Custom Meal Plans",
      description: "Tailored nutrition plans that match your dietary preferences and cultural background"
    },
    {
      icon: <Activity className="w-8 h-8 text-fitness-accent" />,
      title: "Smart Exercise Programs",
      description: "Adaptive workouts for home and gym with video tutorials and progress tracking"
    },
    {
      icon: <Users className="w-8 h-8 text-fitness-success" />,
      title: "Complete Wellness",
      description: "Track weight, calories, vitamins, and water intake all in one place"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-fitness-gradient rounded-full mb-6 animate-pulse-glow">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-fitness-gradient bg-clip-text text-transparent mb-6">
            FitGenius
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Your AI-Powered Fitness Companion
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Transform your health journey with personalized meal plans, smart exercise programs, 
            and real-time AI insights tailored just for you.
          </p>
          <Button 
            onClick={() => navigate('/onboarding')}
            size="lg"
            className="bg-fitness-gradient hover:opacity-90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Transform Your Health?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of users who have already started their personalized fitness journey 
            with AI-powered recommendations and achieve their health goals faster than ever.
          </p>
          <Button 
            onClick={() => navigate('/onboarding')}
            size="lg"
            className="bg-fitness-gradient hover:opacity-90 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
