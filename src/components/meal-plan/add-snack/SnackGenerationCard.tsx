
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap } from "lucide-react";
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
    <Card className="bg-white/80 backdrop-blur-sm border-fitness-primary-200">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-fitness-primary-800 mb-2">
            Generate Perfect AI Snack
          </h3>
          <p className="text-fitness-primary-600 mb-4">
            Our AI will create a personalized snack that fits your remaining calories and preferences
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-fitness-primary-100 text-fitness-primary-700 border-fitness-primary-200 px-4 py-2 text-lg font-semibold">
              <Zap className="w-4 h-4 mr-2" />
              {remainingCalories} cal available
            </Badge>
          </div>
          
          <p className="text-sm text-fitness-primary-500">
            AI considers your dietary preferences, allergies, and nutrition goals
          </p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
            className="border-fitness-primary-300 text-fitness-primary-700 hover:bg-fitness-primary-50"
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          
          <Button
            onClick={onGenerate}
            disabled={isGenerating}
            size="sm"
            className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 hover:from-fitness-primary-600 hover:to-fitness-accent-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('common.generateAISnack') || 'Generate AI Snack'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
