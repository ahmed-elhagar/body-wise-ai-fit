
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Wand2 } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface EmptyWeekStateProps {
  onGenerateClick: () => void;
}

const EmptyWeekState = ({ onGenerateClick }: EmptyWeekStateProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-xl backdrop-blur-sm">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-fitness-primary to-pink-500 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <ChefHat className="w-12 h-12 text-white" />
      </div>
      
      <h3 className="text-3xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-fitness-primary to-pink-600 bg-clip-text text-transparent">
        No Meal Plan Found
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed text-lg">
        Generate your personalized weekly meal plan with AI
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={onGenerateClick} 
          className="bg-fitness-gradient hover:opacity-90 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
        >
          <Sparkles className="w-6 h-6 mr-3" />
          Generate Meal Plan
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Wand2 className="w-4 h-4" />
          <span>AI Powered Nutrition</span>
        </div>
      </div>
    </Card>
  );
};

export default EmptyWeekState;
