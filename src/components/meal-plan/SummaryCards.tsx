
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, RotateCcw, Award, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface SummaryCardsProps {
  todaysMeals: any[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onAddSnack: () => void;
  onRegeneratePlan: () => void;
}

const SummaryCards = ({
  todaysMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onAddSnack,
  onRegeneratePlan
}: SummaryCardsProps) => {
  const { t, isRTL } = useI18n();

  const proteinGoal = 150;
  const proteinProgress = Math.min(100, (totalProtein / proteinGoal) * 100);

  return (
    <div className="flex lg:flex-col gap-4 lg:space-y-6">
      {/* Today's Summary Card */}
      <Card className="bg-white border-l-4 border-l-red-500 shadow-lg min-w-[280px] lg:min-w-0">
        <CardHeader className="pb-3">
          <CardTitle className={`text-base lg:text-lg font-bold text-gray-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
            {t('mealPlan.todaysSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2 lg:gap-4 text-center">
            <div>
              <div className="text-lg lg:text-2xl font-bold text-red-600">{totalCalories}</div>
              <div className="text-xs text-gray-600">{t('mealPlan.cal')}</div>
            </div>
            <div>
              <div className="text-lg lg:text-2xl font-bold text-blue-600">{totalProtein.toFixed(1)}g</div>
              <div className="text-xs text-gray-600">{t('mealPlan.protein')}</div>
            </div>
            <div>
              <div className="text-lg lg:text-2xl font-bold text-green-600">{todaysMeals?.length || 0}</div>
              <div className="text-xs text-gray-600">{t('mealPlan.meals')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protein Goal Card */}
      <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg min-w-[280px] lg:min-w-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base lg:text-lg font-bold flex items-center gap-2">
            <Award className="w-4 h-4 lg:w-5 lg:h-5" />
            {t('mealPlan.proteinGoal')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold">{totalProtein.toFixed(1)}g</div>
              <div className="text-sm opacity-90">{t('mealPlan.of')} {proteinGoal}g {t('mealPlan.target')}</div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-300" 
                style={{ width: `${proteinProgress}%` }}
              ></div>
            </div>
            <div className="text-center text-sm opacity-90">
              {proteinProgress.toFixed(0)}% Complete
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Today Card */}
      <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg min-w-[280px] lg:min-w-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base lg:text-lg font-bold flex items-center gap-2">
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5" />
            {t('mealPlan.mealsToday')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold">{todaysMeals?.length || 0}</div>
              <div className="text-sm opacity-90">{t('mealPlan.plannedMeals')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white shadow-lg border-0 min-w-[280px] lg:min-w-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base lg:text-lg font-bold text-gray-900">{t('mealPlan.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onRegeneratePlan}
            variant="outline" 
            className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 text-sm"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('mealPlan.regeneratePlan')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
