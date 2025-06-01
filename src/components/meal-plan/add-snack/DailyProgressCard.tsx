
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

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
  const { t } = useI18n();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-fitness-accent-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-4 h-4 text-fitness-accent-600" />
            {t('mealPlan.dailyProgress') || 'Daily Progress'}
          </h3>
          <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200">
            Day {selectedDay}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('mealPlan.calories') || 'Calories'}</span>
            <span className="font-semibold">
              {currentDayCalories} / {dynamicTargetCalories}
            </span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-gray-200"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{Math.round(progressPercentage)}% {t('mealPlan.complete') || 'complete'}</span>
            <span>{remainingCalories} {t('mealPlan.addSnackDialog.caloriesAvailable') || 'calories available'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
