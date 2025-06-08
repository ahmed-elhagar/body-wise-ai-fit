
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/useI18n";
import { Flame, Target } from "lucide-react";

interface CalorieProgressCardProps {
  currentDayCalories: number;
  targetDayCalories: number;
}

const CalorieProgressCard = ({ currentDayCalories, targetDayCalories }: CalorieProgressCardProps) => {
  const { t, isRTL } = useI18n();

  const progressPercentage = Math.min((currentDayCalories / targetDayCalories) * 100, 100);
  const remainingCalories = Math.max(0, targetDayCalories - currentDayCalories);

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Target className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-800">{t('mealPlan:addSnackDialog.caloriesAvailable')}</span>
        </div>
        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-600">
            {remainingCalories} {t('mealPlan:cal')}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2" />
        <div className={`flex justify-between text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span>{currentDayCalories} {t('mealPlan:cal')}</span>
          <span>{targetDayCalories} {t('mealPlan:cal')}</span>
        </div>
      </div>
    </Card>
  );
};

export default CalorieProgressCard;
