
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Target } from "lucide-react";

interface EmptyWeekStateProps {
  onGenerateClick: () => void;
}

const EmptyWeekState = ({ onGenerateClick }: EmptyWeekStateProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-600 via-fitness-primary-700 to-fitness-accent-600 text-white">
        <CardContent className="p-6 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">No Meal Plan Yet</h2>
          <p className="text-fitness-primary-100">
            Start your healthy journey with an AI-generated meal plan
          </p>
        </CardContent>
      </Card>

      {/* Main CTA */}
      <Card className="border-dashed border-2 border-fitness-primary-300">
        <CardContent className="p-8 text-center">
          <Target className="w-20 h-20 mx-auto mb-6 text-fitness-primary-400" />
          <h3 className="text-2xl font-semibold mb-4 text-fitness-primary-800">
            Ready to Start Your Meal Plan?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Generate a personalized weekly meal plan based on your dietary preferences, 
            nutritional goals, and lifestyle. Our AI will create balanced meals that fit your needs.
          </p>
          
          <Button
            onClick={onGenerateClick}
            size="lg"
            className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 hover:from-fitness-primary-600 hover:to-fitness-accent-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate AI Meal Plan
          </Button>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <span>AI analyzes your preferences</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <span>Creates balanced weekly meals</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <span>Generates shopping list</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold mb-2">Weekly Planning</h4>
            <p className="text-sm text-gray-600">7 days of perfectly planned meals</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-semibold mb-2">Nutrition Tracking</h4>
            <p className="text-sm text-gray-600">Track calories, protein, and macros</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold mb-2">Smart Recipes</h4>
            <p className="text-sm text-gray-600">AI-generated detailed cooking instructions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmptyWeekState;
