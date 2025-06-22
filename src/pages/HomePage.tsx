
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  UtensilsCrossed, 
  MessageSquare, 
  User,
  Crown,
  Activity
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Dumbbell,
      title: 'Exercise Programs',
      description: 'AI-generated personalized workout routines',
      link: '/exercise',
      color: 'bg-blue-500'
    },
    {
      icon: UtensilsCrossed,
      title: 'Meal Planning',
      description: 'Custom meal plans based on your goals',
      link: '/meal-plan',
      color: 'bg-green-500'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Get fitness and nutrition advice',
      link: '/chat',
      color: 'bg-purple-500'
    },
    {
      icon: User,
      title: 'Profile',
      description: 'Manage your fitness profile',
      link: '/profile',
      color: 'bg-orange-500'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to FitFatta AI
            </CardTitle>
            <p className="text-gray-600">
              Your AI-powered fitness and nutrition companion
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Please sign in to access your personalized fitness journey.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to FitFatta AI
          </h1>
          <p className="text-gray-600 text-lg">
            Your personalized fitness and nutrition journey starts here
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <Link to={feature.link}>
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">AI-Powered</h3>
              <p className="text-gray-600 text-sm">Personalized recommendations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Premium Features</h3>
              <p className="text-gray-600 text-sm">Advanced analytics & coaching</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">24/7 Support</h3>
              <p className="text-gray-600 text-sm">AI assistant always available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
