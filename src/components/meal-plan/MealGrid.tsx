
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Book, ArrowLeftRight, Plus } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface MealGridProps {
  meals: any[];
  onShowRecipe: (meal: any) => void;
  onExchangeMeal: (meal: any) => void;
  onAddSnack: () => void;
  onShowShoppingList: () => void;
  onRegeneratePlan: () => void;
  dayNumber: number;
}

const MealGrid = ({
  meals,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack,
  onRegeneratePlan,
  dayNumber
}: MealGridProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  const getMealsByType = (dayMeals: any[]) => {
    const grouped = dayMeals.reduce((acc, meal) => {
      const type = meal.meal_type || 'snack';
      if (!acc[type]) acc[type] = [];
      acc[type].push(meal);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      breakfast: grouped.breakfast || [],
      lunch: grouped.lunch || [],
      dinner: grouped.dinner || [],
      snack: grouped.snack || []
    };
  };

  const calculateDayStats = (dayMeals: any[]) => {
    return dayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const mealsByType = getMealsByType(meals);
  const dayStats = calculateDayStats(meals);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Day Header with Stats */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{mealPlanT('dayOverview')}</h2>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {dayStats.calories} {mealPlanT('cal')}
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {dayStats.protein.toFixed(1)}g {mealPlanT('protein')}
            </Badge>
            <Badge className="bg-green-100 text-green-700 border-green-200">
              {meals.length} {mealPlanT('meals')}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onAddSnack}
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {mealPlanT('addSnack')}
          </Button>
          
          <Button
            onClick={onRegeneratePlan}
            variant="outline"
            size="sm"
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {mealPlanT('shuffleMeals')}
          </Button>
        </div>
      </div>

      {/* Meals by Type */}
      <div className="space-y-6">
        {Object.entries(mealsByType).map(([mealType, mealList]) => {
          if (mealList.length === 0 && mealType !== 'snack') return null;
          
          return (
            <div key={mealType} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900 capitalize">
                  {mealPlanT(mealType as any)}
                </h3>
                <div className="text-sm text-gray-500">
                  {mealList.length} {mealList.length === 1 ? mealPlanT('item') : mealPlanT('items')}
                </div>
              </div>

              {mealList.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mealList.map((meal, index) => (
                    <Card key={`${meal.id}-${index}`} className="group hover:shadow-lg transition-all duration-200 border-0 bg-white overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex-1 text-base lg:text-lg mr-3 line-clamp-2">
                            {meal.name}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-medium shrink-0 ${
                              mealType === 'breakfast' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                              mealType === 'lunch' ? 'bg-green-50 text-green-700 border-green-200' :
                              mealType === 'dinner' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {mealPlanT(mealType as any)}
                          </Badge>
                        </div>

                        {/* Nutrition Info */}
                        <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                          <div className="text-center bg-red-50 rounded-lg p-2">
                            <div className="font-bold text-red-600">{Math.round(meal.calories || 0)}</div>
                            <div className="text-xs text-red-500">{mealPlanT('cal')}</div>
                          </div>
                          <div className="text-center bg-blue-50 rounded-lg p-2">
                            <div className="font-bold text-blue-600">{Math.round(meal.protein || 0)}g</div>
                            <div className="text-xs text-blue-500">{mealPlanT('protein')}</div>
                          </div>
                          <div className="text-center bg-green-50 rounded-lg p-2">
                            <div className="font-bold text-green-600">{Math.round(meal.carbs || 0)}g</div>
                            <div className="text-xs text-green-500">{mealPlanT('carbs')}</div>
                          </div>
                        </div>

                        {/* Prep Time */}
                        {meal.prep_time && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <Clock className="w-3 h-3" />
                            <span>{meal.prep_time} {mealPlanT('minutes')}</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Button
                            onClick={() => onShowRecipe(meal)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Book className="w-3 h-3 mr-1" />
                            {mealPlanT('recipe')}
                          </Button>
                          <Button
                            onClick={() => onExchangeMeal(meal)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            <ArrowLeftRight className="w-3 h-3 mr-1" />
                            {mealPlanT('exchange')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : mealType === 'snack' ? (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50 rounded-xl">
                  <CardContent className="p-6 text-center">
                    <Plus className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">{mealPlanT('noMealsPlanned')}</p>
                    <Button
                      onClick={onAddSnack}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {mealPlanT('addSnack')}
                    </Button>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MealGrid;
