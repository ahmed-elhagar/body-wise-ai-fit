
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/hooks/useI18n";
import { CalendarDays, Target, TrendingUp, Flame } from "lucide-react";

interface DailySummaryProps {
  selectedDay: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealsCount: number;
  targetCalories?: number;
}

const DailySummary = ({
  selectedDay,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  mealsCount,
  targetCalories = 2000
}: DailySummaryProps) => {
  const { t, isRTL } = useI18n();

  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-800">
            {t('Day')} {selectedDay} {t('Summary')}
          </h3>
          <p className="text-blue-600">
            {mealsCount} {t('meals planned')}
          </p>
        </div>
      </div>

      {/* Nutrition Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalCalories}</div>
          <div className="text-sm text-gray-600">{t('Calories')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">{totalProtein.toFixed(0)}g</div>
          <div className="text-sm text-gray-600">{t('Protein')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-700">{totalCarbs.toFixed(0)}g</div>
          <div className="text-sm text-gray-600">{t('Carbs')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-700">{totalFat.toFixed(0)}g</div>
          <div className="text-sm text-gray-600">{t('Fat')}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{t('Daily Target')}</span>
          <Badge className={`${calorieProgress >= 80 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            <Target className="w-3 h-3 mr-1" />
            {Math.round(calorieProgress)}%
          </Badge>
        </div>
        <Progress value={calorieProgress} className="h-3" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{totalCalories} / {targetCalories} {t('calories')}</span>
          <span>{targetCalories - totalCalories} {t('remaining')}</span>
        </div>
      </div>
    </Card>
  );
};

export default DailySummary;
