
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Zap, Heart } from "lucide-react";

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
    <div className="space-y-4">
      {/* Smart Snack Card */}
      <Card className="p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200">
        <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">{t('mealPlan.addSnack.smartSnack')}</h3>
            <p className="text-sm text-green-600">{t('mealPlan.addSnack.personalizedForYou')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/70 p-3 rounded-lg text-center">
            <div className={`flex items-center justify-center gap-1 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-gray-600">
                {t('mealPlan.addSnack.remainingCalories')}
              </span>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {remainingCalories} {t('mealPlan.cal')}
            </Badge>
          </div>
          
          <div className="bg-white/70 p-3 rounded-lg text-center">
            <div className={`flex items-center justify-center gap-1 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-xs font-medium text-gray-600">
                {t('mealPlan.addSnack.perfectFit')}
              </span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {t('mealPlan.addSnack.healthyChoice')}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sparkles className="w-4 h-4" />
            <span>{t('mealPlan.addSnack.generateSnack')}</span>
          </div>
        </Button>
        
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 py-3 border-gray-300 hover:bg-gray-50"
        >
          {t('mealPlan.addSnack.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default SnackGenerationSection;
