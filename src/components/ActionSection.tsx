
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, Plus, Target, Flame, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActionSectionProps {
  viewMode: 'daily' | 'weekly';
  totalCalories: number;
  totalProtein: number;
  onShowShoppingList: () => void;
  onAddSnack: () => void;
  showAddSnack: boolean;
  showShoppingList: boolean;
}

const ActionSection = ({
  viewMode,
  totalCalories,
  totalProtein,
  onShowShoppingList,
  onAddSnack,
  showAddSnack,
  showShoppingList
}: ActionSectionProps) => {
  const { t, isRTL } = useLanguage();
  
  // Target values (these could come from user profile)
  const targetCalories = 2000;
  const targetProtein = 150;
  
  const calorieProgress = Math.min((totalCalories / targetCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / targetProtein) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="p-4 bg-gradient-to-br from-white via-fitness-primary/5 to-pink-50 border-0 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          
          {/* Summary Section */}
          <div className="lg:col-span-2">
            <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-6 h-6 bg-fitness-gradient rounded-full flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                {viewMode === 'daily' ? t('mealPlan.todaysSummary') : t('mealPlan.weeklyOverview')}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Calories */}
              <div className="space-y-2">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Flame className="w-3 h-3 text-red-500" />
                    <span className="text-xs font-medium text-gray-700">{t('mealPlan.calories')}</span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {totalCalories} / {targetCalories}
                  </span>
                </div>
                <Progress value={calorieProgress} className="h-1.5" />
              </div>

              {/* Protein */}
              <div className="space-y-2">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-medium text-gray-700">{t('mealPlan.protein')}</span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {totalProtein}g / {targetProtein}g
                  </span>
                </div>
                <Progress value={proteinProgress} className="h-1.5" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'} ${isRTL ? 'flex-row-reverse' : ''}`}>
            {showShoppingList && (
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium rounded-lg px-4 py-2"
                onClick={onShowShoppingList}
              >
                <ShoppingCart className={`w-3 h-3 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                {t('mealPlan.shoppingList')}
              </Button>
            )}
            
            {showAddSnack && (
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:border-green-300 hover:text-green-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium rounded-lg px-4 py-2"
                onClick={onAddSnack}
              >
                <Plus className={`w-3 h-3 ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} />
                {t('mealPlan.addSnack')}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActionSection;
