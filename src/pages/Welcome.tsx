
import React from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Target, Dumbbell } from 'lucide-react';

const Welcome = () => {
  const { user } = useAuth();

  // Redirect if not authenticated - moved after all hooks
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl w-full">
        <Card className="p-8 shadow-xl border-0 text-center">
          <div className="w-20 h-20 bg-fitness-gradient rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-fitness-gradient bg-clip-text text-transparent">
            Welcome to FitFatta!
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Welcome {user.first_name || user.email}! Let's get you started on your fitness journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">Complete Profile</h3>
              <p className="text-sm text-blue-700">Set up your personal information</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">Set Goals</h3>
              <p className="text-sm text-green-700">Define your fitness objectives</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <Dumbbell className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">Start Training</h3>
              <p className="text-sm text-purple-700">Begin your workout journey</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/profile'}
              className="bg-fitness-gradient hover:opacity-90 text-white px-6 py-2"
            >
              Complete Profile
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="px-6 py-2"
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
