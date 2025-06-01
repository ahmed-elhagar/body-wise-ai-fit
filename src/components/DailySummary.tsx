import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Zap, TrendingUp, Target } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface DailySummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories?: number;
  targetProtein?: number;
}

const DailySummary = ({ totalCalories, totalProtein, totalCarbs, totalFat, targetCalories = 2000, targetProtein = 150 }: DailySummaryProps) => {
  const { t, isRTL } = useI18n();

  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / targetProtein) * 100, 100);
  const carbProgress = Math.min((totalCarbs / targetCalories) * 100, 100);
  const fatProgress = Math.min((totalFat / targetCalories) * 100, 100);

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('dailySummary')}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Calories */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-500" />
              <span className="text-xs font-medium text-gray-700">{t('calories')}</span>
            </div>
            <span className="text-xs text-gray-600">
              {totalCalories} / {targetCalories}
            </span>
          </div>
          <Progress value={calorieProgress} className="h-1.5" />
        </div>

        {/* Protein */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium text-gray-700">{t('protein')}</span>
            </div>
            <span className="text-xs text-gray-600">
              {totalProtein}g / {targetProtein}g
            </span>
          </div>
          <Progress value={proteinProgress} className="h-1.5" />
        </div>

        {/* Carbs */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-700">{t('carbs')}</span>
            </div>
            <span className="text-xs text-gray-600">
              {totalCarbs}g
            </span>
          </div>
          <Progress value={carbProgress} className="h-1.5" />
        </div>

        {/* Fat */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium text-gray-700">{t('fat')}</span>
            </div>
            <span className="text-xs text-gray-600">
              {totalFat}g
            </span>
          </div>
          <Progress value={fatProgress} className="h-1.5" />
        </div>
      </div>
    </Card>
  );
};

export default DailySummary;
