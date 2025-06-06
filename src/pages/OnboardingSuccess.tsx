
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Target, Utensils, Dumbbell, TrendingUp } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  const quickActions = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "View Your Meal Plan",
      description: "Get your personalized nutrition plan",
      action: () => navigate('/meal-plan'),
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: "Start Your Workout",
      description: "Begin your fitness journey today",
      action: () => navigate('/exercise'),
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Set Your Goals",
      description: "Define your fitness objectives",
      action: () => navigate('/goals'),
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your achievements",
      action: () => navigate('/progress'),
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎉 Welcome to FitGenius, {profile?.first_name}!
          </h1>
          
          <p className="text-xl text-gray-600 mb-2">
            Your personalized fitness journey starts now
          </p>
          
          <p className="text-gray-500">
            We've created a customized plan based on your preferences and goals
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 bg-white/80 backdrop-blur-sm"
              onClick={action.action}
            >
              <div className="flex items-start gap-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl shadow-lg`}>
                  {action.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {action.description}
                  </p>
                </div>
                
                <div className="text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Profile Summary */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile Summary</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Goal</p>
              <p className="font-semibold text-gray-800">{profile?.fitness_goal || 'Not set'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Activity Level</p>
              <p className="font-semibold text-gray-800">{profile?.activity_level || 'Not set'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Height</p>
              <p className="font-semibold text-gray-800">{profile?.height ? `${profile.height} cm` : 'Not set'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-semibold text-gray-800">{profile?.weight ? `${profile.weight} kg` : 'Not set'}</p>
            </div>
          </div>
        </Card>

        {/* Continue to Dashboard */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Continue to Dashboard
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            You can always update your preferences in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;
