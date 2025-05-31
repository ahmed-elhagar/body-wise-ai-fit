
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SnackGenerationCardProps {
  remainingCalories: number;
  isGenerating: boolean;
  onGenerate: () => void;
  onClose: () => void;
}

export const SnackGenerationCard = ({
  remainingCalories,
  isGenerating,
  onGenerate,
  onClose
}: SnackGenerationCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-fitness-accent-200">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-fitness-accent-500 to-fitness-accent-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-fitness-accent-800 mb-2">
            {t('mealPlan.addSnackDialog.generateSnack') || 'Generate AI Snack'}
          </h3>
          <p className="text-fitness-accent-600 mb-4">
            {t('mealPlan.addSnackDialog.perfectFit') || 'Perfect fit for your remaining calories'}
          </p>
          
          <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 px-4 py-2 text-lg font-semibold">
            {remainingCalories} {t('mealPlan.cal') || 'cal'}
          </Badge>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
            className="border-fitness-accent-300 text-fitness-accent-700 hover:bg-fitness-accent-50"
          >
            {t('mealPlan.addSnackDialog.cancel') || 'Cancel'}
          </Button>
          
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            size="sm"
            variant="accent"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('mealPlan.addSnackDialog.generateAISnack') || 'Generate AI Snack'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
