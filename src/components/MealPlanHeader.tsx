
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MealPlanHeaderProps {
  onShowAIDialog: () => void;
  onRegeneratePlan: () => void;
  isGenerating: boolean;
}

const MealPlanHeader = ({ onShowAIDialog, onRegeneratePlan, isGenerating }: MealPlanHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meal Plan</h1>
          <p className="text-gray-600">Tuesday, January 30, 2024</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={onShowAIDialog}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Generate
        </Button>
        <Button 
          onClick={onRegeneratePlan}
          disabled={isGenerating}
          className="bg-fitness-gradient hover:opacity-90 text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Regenerate Plan
        </Button>
      </div>
    </div>
  );
};

export default MealPlanHeader;
