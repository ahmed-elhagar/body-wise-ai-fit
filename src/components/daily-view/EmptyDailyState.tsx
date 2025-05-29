
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmptyDailyStateProps {
  onGenerate: () => void;
}

const EmptyDailyState = ({ onGenerate }: EmptyDailyStateProps) => {
  const { t } = useLanguage();

  return (
    <Card className="p-6 text-center bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
        <ChefHat className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{t('noMealsToday')}</h3>
      <p className="text-gray-600 mb-6 text-sm max-w-sm mx-auto leading-relaxed">{t('generateNewPlan')}</p>
      <Button 
        onClick={onGenerate} 
        className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3"
        aria-label={t('generateMealPlan')}
      >
        <Plus className="w-5 h-5 mr-2" />
        {t('generateMealPlan')}
      </Button>
    </Card>
  );
};

export default EmptyDailyState;
