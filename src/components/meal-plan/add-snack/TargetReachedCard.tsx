
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TargetReachedCardProps {
  onClose: () => void;
}

export const TargetReachedCard = ({ onClose }: TargetReachedCardProps) => {
  const { t, isRTL } = useLanguage();

  console.log('🌐 TargetReachedCard translation check:', {
    language: isRTL ? 'ar' : 'en',
    isRTL,
    targetReachedTranslation: t('mealPlan.targetReached'),
    excellentProgressTranslation: t('mealPlan.excellentProgress')
  });

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-6">
        <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            {t('mealPlan.targetReached') || 'Daily calorie target reached!'}
          </h3>
          <p className="text-green-600 mb-4">
            {t('mealPlan.excellentProgress') || "Excellent progress! You've reached your daily nutrition goals."}
          </p>
          
          <div className={`flex items-center justify-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              {t('mealPlan.perfectDay') || 'Perfect Day'}
            </span>
          </div>
          
          <p className="text-sm text-green-500 mb-6">
            {t('mealPlan.considerLightSnack') || 'Consider a light snack or some water to complete your day.'}
          </p>
          
          <Button
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {t('common.close') || 'Close'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
