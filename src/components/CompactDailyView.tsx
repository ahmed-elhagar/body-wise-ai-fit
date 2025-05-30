
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, ChefHat, Clock, Flame, Zap, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CompactMealCard from "@/components/daily-view/CompactMealCard";
import DailyNutritionSummary from "@/components/daily-view/DailyNutritionSummary";
import type { Meal } from "@/types/meal";

interface CompactDailyViewProps {
  todaysMeals: Meal[];
  totalCalories: number;
  totalProtein: number;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, index: number) => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
  onGenerate: () => void;
}

const CompactDailyView = ({
  todaysMeals,
  totalCalories,
  totalProtein,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack,
  onShowShoppingList,
  onGenerate
}: CompactDailyViewProps) => {
  const { t, isRTL } = useLanguage();

  // Group meals by type
  const mealsByType = todaysMeals.reduce((acc, meal, index) => {
    const type = meal.meal_type || meal.type || 'meal';
    if (!acc[type]) acc[type] = [];
    acc[type].push({ ...meal, originalIndex: index });
    return acc;
  }, {} as Record<string, (Meal & { originalIndex: number })[]>);

  const mealTypeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  if (todaysMeals.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-white via-blue-50/30 to-green-50/50 border-0 shadow-xl backdrop-blur-sm">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <ChefHat className="w-10 h-10 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          {t('mealPlan.noMealsToday')}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
          {t('mealPlan.generateFirstPlan')}
        </p>
        
        <Button 
          onClick={onGenerate} 
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-2xl"
        >
          <Sparkles className="w-5 h-5 mr-3" />
          {t('mealPlan.generateMealPlan')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced Nutrition Summary */}
      <DailyNutritionSummary
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        onShowShoppingList={onShowShoppingList}
        onAddSnack={onAddSnack}
      />

      {/* Quick Action Buttons */}
      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button 
          variant="outline" 
          className="flex-1 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
          onClick={onShowShoppingList}
        >
          <ShoppingCart className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('mealPlan.shoppingList')}
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 bg-white hover:bg-green-50 border-green-200 text-green-700 shadow-sm"
          onClick={onAddSnack}
        >
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('mealPlan.addSnack')}
        </Button>
      </div>

      {/* Meals by Type */}
      {mealTypeOrder.map(mealType => {
        const meals = mealsByType[mealType] || [];
        if (meals.length === 0) return null;

        return (
          <Card key={mealType} className="p-4 bg-white border border-gray-200 shadow-lg rounded-xl">
            <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg capitalize">
                  {t(`common.${mealType}`)}
                </h3>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {meals.length} {meals.length === 1 ? t('mealPlan.meal') : t('mealPlan.meals')}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {meals.map((meal, mealIndex) => (
                <CompactMealCard
                  key={`${meal.id}-${meal.originalIndex}`}
                  meal={meal}
                  index={mealIndex}
                  mealType={mealType}
                  onShowRecipe={() => onShowRecipe(meal)}
                  onExchangeMeal={() => onExchangeMeal(meal, meal.originalIndex)}
                />
              ))}
            </div>
          </Card>
        );
      })}

      {/* Enhanced Daily Stats */}
      <Card className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-0 shadow-lg">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="text-xl font-bold text-gray-800">{totalCalories}</div>
                <div className="text-xs text-gray-600">{t('common.calories')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="text-xl font-bold text-gray-800">{totalProtein}g</div>
                <div className="text-xs text-gray-600">{t('common.protein')}</div>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-4 h-4" />
            <span>{todaysMeals.length} {t('mealPlan.mealsPlanned')}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompactDailyView;
