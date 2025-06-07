
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Sparkles, Target, Users, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  // Redirect logic
  useEffect(() => {
    if (!user) {
      console.log('Welcome - No user, redirecting to auth');
      navigate('/auth', { replace: true });
      return;
    }

    // Only redirect to signup if profile is missing basic info
    if (profile && (!profile.first_name || !profile.last_name || !profile.age)) {
      console.log('Welcome - Profile missing basic info, redirecting to signup');
      navigate('/signup', { replace: true });
      return;
    }

    console.log('Welcome - User authenticated with complete profile, staying on welcome');
  }, [user, profile, navigate]);

  const features = [
    {
      icon: Target,
      title: "Personalized Plans",
      description: "AI-generated meal and workout plans tailored to your goals"
    },
    {
      icon: Zap,
      title: "Smart Tracking",
      description: "Easy progress tracking with intelligent insights"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Connect with coaches and community members"
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Advanced AI technology to optimize your fitness journey"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to FitGenius!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {profile?.first_name && `Hi ${profile.first_name}! `}
            Your account has been successfully created. Get ready to transform your fitness journey with AI-powered personalization.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {profile?.fitness_goal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not Set'}
              </div>
              <div className="text-gray-600 text-sm">Fitness Goal</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {profile?.activity_level?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not Set'}
              </div>
              <div className="text-gray-600 text-sm">Activity Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {profile?.ai_generations_remaining || 5}
              </div>
              <div className="text-gray-600 text-sm">AI Credits Remaining</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="px-8 py-4 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300 text-lg"
          >
            Complete Profile
          </Button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Generate your first AI meal plan
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Create a personalized workout routine
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Track your progress and achievements
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
              Connect with coaches for expert guidance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
