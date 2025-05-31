
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Plus, RotateCcw, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealGridProps {
  meals: DailyMeal[];
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  dayNumber: number;
}

const MealGrid = ({ meals, onShowRecipe, onExchangeMeal, onAddSnack, dayNumber }: MealGridProps) => {
  const { t } = useLanguage();

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: t('mealPlan:breakfast'),
      lunch: t('mealPlan:lunch'),
      dinner: t('mealPlan:dinner'),
      snack: t('mealPlan:snack')
    };
    return labels[type] || type;
  };

  const getMealTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      breakfast: 'bg-orange-500',
      lunch: 'bg-green-500',
      dinner: 'bg-blue-500',
      snack: 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  // Group meals by type
  const groupedMeals = meals.reduce((acc, meal) => {
    const type = meal.meal_type || 'snack';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, DailyMeal[]>);

  const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];

  if (meals.length === 0) {
    return (
      <Card className="p-12 text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
          <UtensilsCrossed className="w-12 h-12 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          {t('mealPlan:noMealsToday')}
        </h3>
        <p className="text-gray-600 mb-6 text-lg">
          {t('mealPlan:generateNewPlan')}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {mealOrder.map((mealType) => {
        const mealsOfType = groupedMeals[mealType] || [];
        
        return (
          <div key={mealType} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${getMealTypeColor(mealType)}`} />
                <h3 className="text-xl font-bold text-gray-800">
                  {getMealTypeLabel(mealType)}
                </h3>
                <Badge variant="outline" className="bg-white/50">
                  {mealsOfType.length} {mealsOfType.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              
              {mealType === 'snack' && (
                <Button
                  onClick={onAddSnack}
                  variant="outline"
                  size="sm"
                  className="hover:bg-blue-50 border-blue-200 text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('mealPlan:addSnack')}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealsOfType.map((meal, index) => (
                <Card 
                  key={`${meal.id}-${index}`}
                  className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-0 shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                        {meal.food_name}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={`${getMealTypeColor(mealType)} text-white text-xs`}
                      >
                        {getMealTypeLabel(mealType)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {Math.round(meal.calories || 0)}
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {t('mealPlan:cal')}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {Math.round(meal.protein || 0)}g
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {t('mealPlan:protein')}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {Math.round(meal.carbs || 0)}g
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          {t('mealPlan:carbs')}
                        </div>
                      </div>
                    </div>

                    {meal.prep_time && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{meal.prep_time} {t('mealPlan:minutes')}</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => onShowRecipe(meal)}
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-blue-50 border-blue-200 text-blue-600"
                      >
                        {t('mealPlan:recipe')}
                      </Button>
                      
                      <Button
                        onClick={() => onExchangeMeal(meal)}
                        variant="outline"
                        size="sm"
                        className="flex-1 hover:bg-purple-50 border-purple-200 text-purple-600"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        {t('mealPlan:exchange')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MealGrid;
