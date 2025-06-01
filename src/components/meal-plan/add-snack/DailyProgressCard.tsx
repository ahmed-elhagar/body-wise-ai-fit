
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailyProgressCardProps {
  selectedDay: number;
  currentDayCalories: number;
  dynamicTargetCalories: number;
  remainingCalories: number;
  progressPercentage: number;
}

export const DailyProgressCard = ({
  selectedDay,
  currentDayCalories,
  dynamicTargetCalories,
  remainingCalories,
  progressPercentage
}: DailyProgressCardProps) => {
  const { t, isRTL } = useLanguage();

  const getDayName = (dayNumber: number) => {
    return t(`mealPlan.dayNames.${dayNumber}`) || `Day ${dayNumber}`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-fitness-primary-200">
      <CardContent className="p-6">
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-fitness-accent-500 to-fitness-accent-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="text-lg font-semibold text-fitness-primary-800">
              {getDayName(selectedDay)}
            </h3>
            <p className="text-fitness-primary-600 text-sm">
              {t('mealPlan.dailyProgress') || 'Daily Progress'}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-4 h-4 text-fitness-primary-500" />
              <span className="text-sm font-medium text-fitness-primary-700">
                {t('mealPlan.calorieProgress') || 'Calorie Progress'}
              </span>
            </div>
            <Badge className="bg-fitness-primary-100 text-fitness-primary-700 border-fitness-primary-200">
              {Math.round(progressPercentage)}%
            </Badge>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
          
          <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-fitness-primary-600">
                {t('mealPlan.consumed') || 'Consumed'}:
              </span>
              <span className="font-semibold text-fitness-primary-800">
                {currentDayCalories} {t('mealPlan.cal') || 'cal'}
              </span>
            </div>
            <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-fitness-primary-600">
                {t('mealPlan.target') || 'Target'}:
              </span>
              <span className="font-semibold text-fitness-primary-800">
                {dynamicTargetCalories} {t('mealPlan.cal') || 'cal'}
              </span>
            </div>
          </div>
          
          {remainingCalories > 0 && (
            <div className={`flex items-center justify-center gap-2 p-3 bg-fitness-accent-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Zap className="w-4 h-4 text-fitness-accent-600" />
              <span className="text-sm font-medium text-fitness-accent-700">
                {remainingCalories} {t('mealPlan.calAvailable') || 'cal available'}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
