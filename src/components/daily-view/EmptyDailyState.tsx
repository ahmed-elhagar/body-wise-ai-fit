
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyDailyStateProps {
  onGenerate: () => void;
}

const EmptyDailyState = ({ onGenerate }: EmptyDailyStateProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-xl">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-fitness-primary to-pink-500 rounded-full flex items-center justify-center shadow-lg">
        <ChefHat className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        {t('mealPlan.noMealsToday')}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        {t('mealPlan.generateNewPlan')}
      </p>
      
      <Button 
        onClick={onGenerate} 
        className="bg-fitness-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {t('mealPlan.generateMealPlan')}
      </Button>
    </Card>
  );
};

export default EmptyDailyState;
