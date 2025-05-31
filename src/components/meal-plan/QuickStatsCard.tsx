
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calculator, Award } from "lucide-react";
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
    <Card className="card-gradient-border">
      <CardHeader className="pb-4 bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50">
        <CardTitle className={`text-h5 font-bold text-fitness-neutral-800 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-accent-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {t('mealPlan.quickStats')}
        </CardTitle>
      </CardHeader>
      <CardContent className="content-spacing">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-fitness-neutral-700">{totalCalories} cal</span>
            <span className="text-fitness-neutral-500">{targetDayCalories} cal</span>
          </div>
          <Progress value={Math.min(100, progress)} className="h-3 bg-fitness-neutral-200" />
          <div className="text-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-fitness-primary-600 to-fitness-accent-600 bg-clip-text text-transparent">
              {progress.toFixed(0)}%
            </span>
            <p className="text-xs text-fitness-neutral-500 mt-1 font-medium">{t('mealPlan.progressPercent')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <div className={`flex items-center justify-between card-padding bg-gradient-to-r from-success-50 to-success-100/80 rounded-xl border border-success-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-success-500 to-success-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-success-800">{t('mealPlan.avgPerMeal')}</span>
            </div>
            <span className="font-bold text-success-700 text-lg">{avgPerMeal.toFixed(0)} {t('mealPlan.cal')}</span>
          </div>

          <div className={`flex items-center justify-between card-padding bg-gradient-to-r from-fitness-orange-50 to-fitness-orange-100/80 rounded-xl border border-fitness-orange-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-fitness-orange-500 to-fitness-orange-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-fitness-orange-800">{t('mealPlan.remainingCalories')}</span>
            </div>
            <span className="font-bold text-fitness-orange-700 text-lg">{remainingCalories} {t('mealPlan.cal')}</span>
          </div>

          <div className={`flex items-center justify-between card-padding bg-gradient-to-r from-fitness-secondary-50 to-fitness-secondary-100/80 rounded-xl border border-fitness-secondary-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-fitness-secondary-500 to-fitness-secondary-600 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-fitness-secondary-800">{t('mealPlan.protein')}</span>
            </div>
            <span className="font-bold text-fitness-secondary-700 text-lg">{totalProtein.toFixed(1)}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
