
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calculator } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuickStatsCardProps {
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  mealCount: number;
}

const QuickStatsCard = ({
  totalCalories,
  totalProtein,
  targetDayCalories,
  mealCount
}: QuickStatsCardProps) => {
  const { t, isRTL } = useLanguage();

  const avgPerMeal = mealCount > 0 ? totalCalories / mealCount : 0;
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);
  const progress = targetDayCalories > 0 ? (totalCalories / targetDayCalories) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-white to-blue-50/50 shadow-lg border-0">
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg font-bold text-gray-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {t('mealPlan.quickStats')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{totalCalories}</span>
            <span className="text-gray-500">{targetDayCalories}</span>
          </div>
          <Progress value={Math.min(100, progress)} className="h-2" />
          <div className="text-center text-sm font-bold text-blue-600">
            {progress.toFixed(0)}%
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-3 bg-green-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calculator className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">{t('mealPlan.avgPerMeal')}</span>
            </div>
            <span className="font-bold text-green-700">{avgPerMeal.toFixed(0)} {t('mealPlan.cal')}</span>
          </div>

          <div className={`flex items-center justify-between p-3 bg-orange-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">{t('mealPlan.remainingCalories')}</span>
            </div>
            <span className="font-bold text-orange-700">{remainingCalories} {t('mealPlan.cal')}</span>
          </div>

          <div className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">{t('mealPlan.protein')}</span>
            </div>
            <span className="font-bold text-blue-700">{totalProtein.toFixed(1)}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
