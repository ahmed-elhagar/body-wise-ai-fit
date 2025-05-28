
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Target, TrendingUp, Flame } from "lucide-react";
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
      <Card className="p-6 bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-lg">
        <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-fitness-gradient rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">{t('mealPlan.todaysSummary')}</h3>
        </div>
        
        <div className="space-y-6">
          {/* Calories */}
          <div className="space-y-3">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-gray-700">{t('mealPlan.calories')}</span>
              </div>
              <span className="text-sm text-gray-600">
                {totalCalories} / {targetCalories}
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={calorieProgress} className="h-2" />
              <div className="text-center">
                <span className="text-lg font-bold text-red-600">{totalCalories}</span>
                <span className="text-sm text-gray-500 ml-1">{t('mealPlan.calToday')}</span>
              </div>
            </div>
          </div>

          {/* Protein */}
          <div className="space-y-3">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{t('mealPlan.protein')}</span>
              </div>
              <span className="text-sm text-gray-600">
                {totalProtein}g / {targetProtein}g
              </span>
            </div>
            <div className="space-y-2">
              <Progress value={proteinProgress} className="h-2" />
              <div className="text-center">
                <span className="text-lg font-bold text-green-600">{totalProtein}g</span>
                <span className="text-sm text-gray-500 ml-1">{t('mealPlan.proteinToday')}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800">{Math.round(totalCalories / 5)}</div>
            <div className="text-xs text-blue-600">{t('mealPlan.avgPerMeal')}</div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800">{Math.round(totalProtein / 5)}</div>
            <div className="text-xs text-purple-600">{t('mealPlan.proteinPerMeal')}</div>
          </div>
        </Card>
      </div>

      {/* Shopping List Button */}
      <Button 
        onClick={onShowShoppingList}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
        size="lg"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {t('mealPlan.shoppingList')}
      </Button>
    </div>
  );
};

export default DailySummary;
