
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Plus, Flame } from "lucide-react";

interface SnackGenerationSectionProps {
  remainingCalories: number;
  isGenerating: boolean;
  onGenerate: () => void;
  onCancel: () => void;
}

const SnackGenerationSection = ({
  remainingCalories,
  isGenerating,
  onGenerate,
  onCancel
}: SnackGenerationSectionProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
      <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-800 mb-1">
            {t('mealPlan.addSnack.generateSnack')}
          </h3>
          <p className="text-sm text-green-600">
            {t('mealPlan.addSnack.perfectFit')}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 mb-4 p-3 bg-white/60 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="text-sm font-medium text-gray-700">
          {remainingCalories} {t('mealPlan.addSnack.caloriesAvailable')}
        </span>
      </div>

      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t('mealPlan.addSnack.generateAISnack')}
        </Button>
        
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 border-green-300 text-green-700 hover:bg-green-50"
        >
          {t('mealPlan.addSnack.cancel')}
        </Button>
      </div>
    </Card>
  );
};

export default SnackGenerationSection;
