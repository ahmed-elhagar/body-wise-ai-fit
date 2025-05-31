
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
    <Card className="bg-gradient-to-br from-white to-slate-50/50 shadow-xl border-0 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className={`text-xl font-bold text-slate-800 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {t('mealPlan.quickStats')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-700">{totalCalories} cal</span>
            <span className="text-slate-500">{targetDayCalories} cal</span>
          </div>
          <Progress value={Math.min(100, progress)} className="h-3 bg-slate-200" />
          <div className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {progress.toFixed(0)}%
            </span>
            <p className="text-xs text-slate-500 mt-1">{t('mealPlan.progressPercent')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-900">{t('mealPlan.avgPerMeal')}</span>
            </div>
            <span className="font-bold text-emerald-700 text-lg">{avgPerMeal.toFixed(0)} {t('mealPlan.cal')}</span>
          </div>

          <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-orange-900">{t('mealPlan.remainingCalories')}</span>
            </div>
            <span className="font-bold text-orange-700 text-lg">{remainingCalories} {t('mealPlan.cal')}</span>
          </div>

          <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-purple-900">{t('mealPlan.protein')}</span>
            </div>
            <span className="font-bold text-purple-700 text-lg">{totalProtein.toFixed(1)}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
