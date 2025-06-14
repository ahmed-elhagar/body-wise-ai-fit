
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, Wand2 } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface EmptyDailyStateProps {
  onGenerate: () => void;
}

const EmptyDailyState = ({ onGenerate }: EmptyDailyStateProps) => {
  const { tFrom } = useI18n();
  const tMealPlan = tFrom('mealPlan');

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 border-0 shadow-xl backdrop-blur-sm">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
        <ChefHat className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {String(tMealPlan('noMealsToday'))}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm mx-auto leading-relaxed">
        {String(tMealPlan('generateNewPlan'))}
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={onGenerate} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
          aria-label={String(tMealPlan('generateMealPlan'))}
        >
          <Sparkles className="w-6 h-6 mr-3" />
          {String(tMealPlan('generateMealPlan'))}
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Wand2 className="w-4 h-4" />
          <span>{String(tMealPlan('aiPowered'))}</span>
        </div>
      </div>
    </Card>
  );
};

export default EmptyDailyState;
