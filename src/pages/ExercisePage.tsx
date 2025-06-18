
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Home, Building2, Sparkles } from 'lucide-react';

const ExercisePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Exercise Programs</h1>
          <p className="text-gray-600">AI-generated personalized workout routines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Home Workouts */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Home Workouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">No equipment needed. Perfect for working out at home.</p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Home Program
              </Button>
            </CardContent>
          </Card>

          {/* Gym Workouts */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Gym Workouts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Full gym equipment access for maximum results.</p>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Gym Program
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Current Program */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-purple-600" />
              Current Program
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No exercise program yet</h3>
              <p className="text-gray-600 mb-4">Generate your first AI-powered workout program to get started</p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90">
                  <Home className="h-4 w-4 mr-2" />
                  Home Program
                </Button>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90">
                  <Building2 className="h-4 w-4 mr-2" />
                  Gym Program
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Progressive Overload</h3>
              <p className="text-gray-600 text-sm">Automatically increases difficulty as you get stronger</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">YT</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">YouTube Integration</h3>
              <p className="text-gray-600 text-sm">Watch exercise tutorials directly in the app</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Personalization</h3>
              <p className="text-gray-600 text-sm">Tailored to your fitness level and goals</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;
