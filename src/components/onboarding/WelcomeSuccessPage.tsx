
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Utensils, Dumbbell, Calendar, Target, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react";

interface WelcomeSuccessPageProps {
  userName: string;
  onGetStarted: () => void;
}

const WelcomeSuccessPage = ({ userName, onGetStarted }: WelcomeSuccessPageProps) => {
  const features = [
    {
      icon: Utensils,
      title: "AI Meal Plans",
      description: "Personalized nutrition plans based on your goals and preferences",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      icon: Dumbbell,
      title: "Custom Workouts",
      description: "Tailored exercise routines for your fitness level and body type",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Calendar,
      title: "Progress Tracking",
      description: "Monitor your journey with detailed analytics and insights",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and achieve your fitness milestones step by step",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Get insights to optimize your health and fitness journey",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50"
    },
    {
      icon: Users,
      title: "Coach Support",
      description: "Access guidance from certified fitness professionals",
      color: "from-teal-500 to-green-500",
      bgColor: "from-teal-50 to-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full space-y-8 animate-fade-in">
        {/* Success Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl animate-scale-in mb-4">
            <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome to FitGenius, {userName}!
              </h1>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your personalized fitness journey starts now. We've created a custom plan based on your unique profile and goals.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm group"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={onGetStarted}
            >
              <div className="space-y-4">
                <div className={`inline-flex p-3 md:p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className="flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
                  <span>Explore now</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Preview */}
        <Card className="p-6 md:p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0 shadow-2xl">
          <div className="text-center space-y-6">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">Your Fitness Journey Awaits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-400">7 Days</div>
                <p className="text-sm text-gray-300">Custom meal plans ready</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400">5 Credits</div>
                <p className="text-sm text-gray-300">AI generations included</p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-400">24/7</div>
                <p className="text-sm text-gray-300">Support available</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="text-center space-y-4">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="px-8 md:px-12 py-4 md:py-6 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
          >
            Start Your Journey 🚀
          </Button>
          
          <p className="text-sm text-gray-500">
            Ready to transform your health and fitness? Let's get started!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSuccessPage;
