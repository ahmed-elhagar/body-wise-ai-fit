
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatsSidebarProps {
  todaysMeals: any[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onAddSnack: () => void;
  onRegeneratePlan: () => void;
}

const StatsSidebar = ({
  todaysMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onAddSnack,
  onRegeneratePlan
}: StatsSidebarProps) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="sticky top-6 space-y-4">
      {/* Today's Summary */}
      <Card className="bg-gray-50 border-l-4 border-l-red-500 shadow-sm rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg font-semibold flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-5 h-5 text-red-500" />
            {t('mealPlan.todaysSummary')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalCalories}</div>
              <div className="text-sm text-gray-600">{t('mealPlan.caloriesConsumed')}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-blue-600">{totalProtein.toFixed(1)}g</div>
                <div className="text-gray-600">{t('mealPlan.protein')}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-green-600">{todaysMeals?.length || 0}</div>
                <div className="text-gray-600">{t('mealPlan.meals')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protein Goal */}
      <Card className="bg-gradient-to-r from-[#3D8CFF] to-[#1E60E0] text-white shadow-lg rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">{t('mealPlan.proteinGoal')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalProtein.toFixed(1)}g</div>
            <div className="text-sm opacity-90">{t('mealPlan.of')} 150g {t('mealPlan.target')}</div>
          </div>
        </CardContent>
      </Card>

      {/* Meals Today */}
      <Card className="bg-gradient-to-r from-[#3BB26D] to-[#53D88C] text-white shadow-lg rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">{t('mealPlan.mealsToday')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold">{todaysMeals?.length || 0}</div>
            <div className="text-sm opacity-90">{t('mealPlan.plannedMeals')}</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">{t('mealPlan.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onAddSnack}
            variant="outline" 
            className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('mealPlan.addSnack')}
          </Button>
          <Button 
            onClick={onRegeneratePlan}
            variant="outline" 
            className="w-full justify-start text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('mealPlan.regeneratePlan')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSidebar;
