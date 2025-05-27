
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Utensils } from "lucide-react";

interface EmptyMealPlanProps {
  onShowAIDialog: () => void;
}

const EmptyMealPlan = ({ onShowAIDialog }: EmptyMealPlanProps) => {
  return (
    <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg text-center">
      <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Meal Plan Yet</h3>
      <p className="text-gray-600 mb-6">Generate your personalized AI meal plan to get started</p>
      <Button 
        onClick={onShowAIDialog}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Generate AI Meal Plan
      </Button>
    </Card>
  );
};

export default EmptyMealPlan;
