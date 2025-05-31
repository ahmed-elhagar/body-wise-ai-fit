
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyStateProps {
  onGeneratePlan: () => void;
}

const EmptyState = ({ onGeneratePlan }: EmptyStateProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-12 text-center shadow-lg rounded-xl">
      <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 rounded-2xl flex items-center justify-center">
        <ChefHat className="w-12 h-12 text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('mealPlan.noMealPlanYet')}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {t('mealPlan.generatePersonalizedPlan')}
      </p>
      <Button 
        onClick={onGeneratePlan}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg shadow-lg rounded-lg"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {t('mealPlan.generateMealPlan')}
      </Button>
    </Card>
  );
};

export default EmptyState;
