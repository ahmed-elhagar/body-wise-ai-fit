
import React from 'react';
import Navigation from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Sparkles, ShoppingCart } from 'lucide-react';

const MealPlanPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Planning</h1>
          <p className="text-gray-600">AI-powered personalized meal plans</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generate New Plan */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Generate New Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Create a personalized weekly meal plan based on your preferences and goals.</p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Meal Plan
              </Button>
            </CardContent>
          </Card>

          {/* Current Plan Overview */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-5 w-5 text-green-600" />
                  This Week's Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <UtensilsCrossed className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No meal plan yet</h3>
                  <p className="text-gray-600 mb-4">Generate your first AI-powered meal plan to get started</p>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Meal Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cultural Adaptation</h3>
              <p className="text-gray-600 text-sm">Meals adapted to your nationality and cultural preferences</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Shopping Lists</h3>
              <p className="text-gray-600 text-sm">Automatically generated shopping lists for your meal plans</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Optimization</h3>
              <p className="text-gray-600 text-sm">Nutrition optimized with macro tracking and balance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MealPlanPage;
