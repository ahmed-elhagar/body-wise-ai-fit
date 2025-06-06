
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Utensils, Dumbbell, Calendar, Target, TrendingUp, Users } from "lucide-react";

interface WelcomeSuccessPageProps {
  userName: string;
  onGetStarted: () => void;
}

const WelcomeSuccessPage = ({ userName, onGetStarted }: WelcomeSuccessPageProps) => {
  const features = [
    {
      icon: Utensils,
      title: "AI Meal Plans",
      description: "Personalized nutrition plans based on your goals",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Dumbbell,
      title: "Custom Workouts",
      description: "Tailored exercise routines for your fitness level",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Calendar,
      title: "Progress Tracking",
      description: "Monitor your journey with detailed analytics",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and achieve your fitness milestones",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Insights to optimize your health journey",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Coach Support",
      description: "Get guidance from certified fitness professionals",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        {/* Success Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg animate-scale-in">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome to FitGenius, {userName}!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your personalized fitness journey starts now. We've created a custom plan based on your profile.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105 cursor-pointer border-0 bg-white/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Preview */}
        <Card className="p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white border-0 shadow-xl">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Your Fitness Journey Awaits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-400">7 Days</div>
                <p className="text-sm text-gray-300">Custom meal plans ready</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-400">5 Credits</div>
                <p className="text-sm text-gray-300">AI generations included</p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-400">24/7</div>
                <p className="text-sm text-gray-300">Support available</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey 🚀
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Ready to transform your health and fitness?
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSuccessPage;
