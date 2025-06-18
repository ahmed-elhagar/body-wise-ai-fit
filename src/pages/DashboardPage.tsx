
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UtensilsCrossed, 
  Dumbbell, 
  Target, 
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const quickStats = [
    {
      title: 'Weekly Progress',
      value: '75%',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Meals Planned',
      value: '21/21',
      icon: UtensilsCrossed,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Workouts Done',
      value: '4/5',
      icon: Dumbbell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Goals on Track',
      value: '3/4',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'Generate Meal Plan',
      description: 'Create AI-powered weekly meal plan',
      icon: UtensilsCrossed,
      path: '/meal-plan',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Start Workout',
      description: 'Begin your exercise session',
      icon: Dumbbell,
      path: '/exercise',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Track Progress',
      description: 'Update your fitness metrics',
      icon: TrendingUp,
      path: '/profile',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('Welcome')}, {user?.user_metadata?.first_name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to crush your fitness goals today?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.path}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Today's Schedule */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Breakfast</p>
                    <p className="text-sm text-gray-600">Oatmeal with berries</p>
                  </div>
                </div>
                <span className="text-sm text-blue-600 font-medium">8:00 AM</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Upper Body Workout</p>
                    <p className="text-sm text-gray-600">45 minutes session</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">6:00 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
