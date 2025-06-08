import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Plus, Flame } from "lucide-react";
import SimpleLoadingIndicator from "@/components/ui/simple-loading-indicator";

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
    <Card className="p-6 bg-gradient-to-br from-success-50 to-success-100 border-success-200">
      <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-600 rounded-full flex items-center justify-center">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-success-800 mb-1">
            {t('mealPlan.addSnack.generateSnack') || 'Generate AI Snack'}
          </h3>
          <p className="text-sm text-success-600">
            {t('mealPlan.addSnack.perfectFit') || 'Perfect fit for your remaining calories'}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 mb-4 p-3 bg-white/60 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Flame className="w-5 h-5 text-fitness-orange-500" />
        <span className="text-sm font-medium text-fitness-neutral-700">
          {remainingCalories} {t('mealPlan.addSnack.caloriesAvailable') || 'calories available'}
        </span>
      </div>

      {isGenerating ? (
        <SimpleLoadingIndicator
          message={t('mealPlan.addSnack.generatingAISnack') || "Generating AI Snack"}
          description="Creating the perfect snack for your remaining calories"
          size="md"
        />
      ) : (
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            className={`flex-1 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Sparkles className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('mealPlan.addSnack.generateAISnack') || 'Generate AI Snack'}
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            className="px-6 border-success-300 text-success-700 hover:bg-success-50"
          >
            {t('mealPlan.addSnack.cancel') || 'Cancel'}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SnackGenerationSection;
