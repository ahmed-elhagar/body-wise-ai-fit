
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, ChefHat } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface MealPlanActionsProps {
  onShowAIDialog: () => void;
  onRegenerateMealPlan: () => void;
  isGenerating: boolean;
}

const MealPlanActions = ({ onShowAIDialog, onRegenerateMealPlan, isGenerating }: MealPlanActionsProps) => {
  const { t } = useI18n();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ChefHat className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            {t('mealPlan.weeklyPlan')}
          </h3>
        </div>
        
        <div className="flex space-x-3">
          <Button
            onClick={onShowAIDialog}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('mealPlan.customizePlan')}
          </Button>
          
          <Button
            onClick={onRegenerateMealPlan}
            disabled={isGenerating}
            variant="outline"
            className="bg-white/80"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('mealPlan.generateNew')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MealPlanActions;
