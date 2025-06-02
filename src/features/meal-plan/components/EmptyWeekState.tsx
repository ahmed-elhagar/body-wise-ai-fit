
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, Target } from "lucide-react";

interface EmptyWeekStateProps {
  onGenerateClick: () => void;
}

export const EmptyWeekState = ({ onGenerateClick }: EmptyWeekStateProps) => {
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
        </CardContent>
      </Card>
    </div>
  );
};
