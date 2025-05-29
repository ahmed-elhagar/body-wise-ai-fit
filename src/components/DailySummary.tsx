
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Flame, Clock, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DailySummaryProps {
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
}

const DailySummary = ({ totalCalories, totalProtein, onShowShoppingList }: DailySummaryProps) => {
  const { t, isRTL } = useLanguage();
  
  // Target values (these could come from user profile)
  const targetCalories = 2000;
  const targetProtein = 150;
  
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / targetProtein) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Main Summary Card */}
      <Card className="p-4 bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-lg">
        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-fitness-gradient rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">{t('mealPlan.todaysSummary')}</h3>
        </div>
        
        <div className="space-y-4">
          {/* Calories */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">{t('mealPlan.calories')}</span>
              </div>
              <span className="text-sm text-gray-600">
                {totalCalories} / {targetCalories}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-2" />
            <div className="text-center">
              <span className="text-xl font-bold text-red-600">{totalCalories}</span>
              <span className="text-xs text-gray-500 ml-1">{t('mealPlan.calToday')}</span>
            </div>
          </div>

          {/* Protein */}
          <div className="space-y-2">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{t('mealPlan.protein')}</span>
              </div>
              <span className="text-sm text-gray-600">
                {totalProtein}g / {targetProtein}g
              </span>
            </div>
            <Progress value={proteinProgress} className="h-2" />
            <div className="text-center">
              <span className="text-xl font-bold text-green-600">{totalProtein}g</span>
              <span className="text-xs text-gray-500 ml-1">{t('mealPlan.proteinToday')}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats Cards */}
      <div className="space-y-3">
        <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-bold text-blue-800">{Math.round(totalCalories / 5)}</div>
              <div className="text-xs text-blue-600">{t('mealPlan.avgPerMeal')}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm font-bold text-purple-800">{Math.round(totalProtein / 5)}</div>
              <div className="text-xs text-purple-600">{t('mealPlan.proteinPerMeal')}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailySummary;
