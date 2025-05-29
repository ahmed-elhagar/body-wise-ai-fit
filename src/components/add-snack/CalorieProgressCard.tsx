
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CalorieProgressCardProps {
  currentDayCalories: number;
  targetDayCalories: number;
}

const CalorieProgressCard = ({ currentDayCalories, targetDayCalories }: CalorieProgressCardProps) => {
  const { t, isRTL } = useLanguage();

  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);
  const calorieProgress = Math.min((currentDayCalories / targetDayCalories) * 100, 100);
  const isNearTarget = calorieProgress >= 95;

  return (
    <Card className="p-6 bg-gradient-to-br from-fitness-primary/5 via-white to-green-50 border-0 shadow-lg">
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
            isNearTarget ? 'bg-green-gradient' : 'bg-fitness-gradient'
          }`}>
            {isNearTarget ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : (
              <Target className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {t('addSnack.dailyProgress')}
            </h3>
            <p className="text-sm text-gray-600">
              {currentDayCalories} / {targetDayCalories} {t('mealPlan.calories')}
            </p>
          </div>
        </div>
        <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
          <div className={`text-3xl font-bold ${isNearTarget ? 'text-green-600' : 'text-fitness-primary'}`}>
            {remainingCalories}
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">
            {t('addSnack.remaining')}
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-600">{t('addSnack.calorieProgress')}</span>
          <span className="font-medium">{Math.round(calorieProgress)}%</span>
        </div>
        <Progress value={calorieProgress} className="h-3 bg-gray-100" />
        {isNearTarget && (
          <div className={`flex items-center gap-2 text-green-600 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle className="w-4 h-4" />
            <span>{t('addSnack.excellentProgress')}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CalorieProgressCard;
