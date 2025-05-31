
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Plus, RotateCcw, Clock, ChefHat } from "lucide-react";
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
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    };
    return labels[type] || type;
  };

  const getMealTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      breakfast: 'bg-orange-100 text-orange-700 border-orange-200',
      lunch: 'bg-green-100 text-green-700 border-green-200',
      dinner: 'bg-blue-100 text-blue-700 border-blue-200',
      snack: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
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
      <Card className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center">
          <UtensilsCrossed className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No meals planned for today
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Add a snack or generate a new meal plan to get started
        </p>
        <Button 
          onClick={onAddSnack}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Snack
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {mealOrder.map((mealType) => {
        const mealsOfType = groupedMeals[mealType] || [];
        
        if (mealsOfType.length === 0) return null;

        return (
          <div key={mealType} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {getMealTypeLabel(mealType)}
                </h3>
                <Badge variant="outline" className="text-xs font-medium">
                  {mealsOfType.length} {mealsOfType.length === 1 ? 'item' : 'items'}
                </Badge>
              </div>
              
              {mealType === 'snack' && (
                <Button
                  onClick={onAddSnack}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Snack
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mealsOfType.map((meal, index) => (
                <Card 
                  key={`${meal.id}-${index}`}
                  className="group hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:scale-[1.02]"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
                        {meal.name}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-medium ml-2 ${getMealTypeColor(mealType)}`}
                      >
                        {getMealTypeLabel(mealType)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    {/* Nutrition Info */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="font-semibold text-red-600">
                          {Math.round(meal.calories || 0)}
                        </div>
                        <div className="text-xs text-gray-500">cal</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {Math.round(meal.protein || 0)}g
                        </div>
                        <div className="text-xs text-gray-500">protein</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-semibold text-green-600">
                          {Math.round(meal.carbs || 0)}g
                        </div>
                        <div className="text-xs text-gray-500">carbs</div>
                      </div>
                    </div>

                    {/* Prep Time */}
                    {meal.prep_time && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{meal.prep_time} minutes prep</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        onClick={() => onShowRecipe(meal)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 rounded-lg"
                      >
                        <ChefHat className="w-3 h-3 mr-1" />
                        Recipe
                      </Button>
                      
                      <Button
                        onClick={() => onExchangeMeal(meal)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 rounded-lg"
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
