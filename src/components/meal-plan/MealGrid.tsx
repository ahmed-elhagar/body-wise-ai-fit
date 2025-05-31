
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
      <Card className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-lg">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          {t('mealPlan:noMealsToday')}
        </h3>
        <p className="text-gray-600 text-sm">
          {t('mealPlan:generateNewPlan')}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {mealOrder.map((mealType) => {
        const mealsOfType = groupedMeals[mealType] || [];
        
        if (mealsOfType.length === 0) return null;

        return (
          <div key={mealType} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getMealTypeColor(mealType)}`} />
                <h3 className="text-xl font-medium text-gray-800">
                  {getMealTypeLabel(mealType)}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {mealsOfType.length} {mealsOfType.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              
              {mealType === 'snack' && (
                <Button
                  onClick={onAddSnack}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
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
                  className="group hover:shadow-md transition-all duration-200 bg-white border border-gray-100 rounded-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-medium text-gray-800 leading-tight">
                        {meal.name || meal.food_item_name}
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-red-600">
                          {Math.round(meal.calories || 0)}
                        </div>
                        <div className="text-xs text-gray-500">cal</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-medium text-blue-600">
                          {Math.round(meal.protein || 0)}g
                        </div>
                        <div className="text-xs text-gray-500">protein</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm font-medium text-green-600">
                          {Math.round(meal.carbs || 0)}g
                        </div>
                        <div className="text-xs text-gray-500">carbs</div>
                      </div>
                    </div>

                    {meal.prep_time && (
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{meal.prep_time} minutes</span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => onShowRecipe(meal)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        Recipe
                      </Button>
                      
                      <Button
                        onClick={() => onExchangeMeal(meal)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Exchange
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
