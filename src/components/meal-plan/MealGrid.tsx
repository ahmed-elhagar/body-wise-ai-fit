
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Book, ArrowLeftRight, RotateCcw } from "lucide-react";
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

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'from-orange-400 to-amber-500';
      case 'lunch': return 'from-green-400 to-emerald-500';
      case 'dinner': return 'from-blue-400 to-indigo-500';
      default: return 'from-purple-400 to-pink-500';
    }
  };

  const getMealTypeBadgeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'lunch': return 'bg-green-50 text-green-700 border-green-200';
      case 'dinner': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Day Header with Stats - More Compact */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-xl p-4 shadow-lg border border-slate-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="text-xl font-bold text-slate-800">{mealPlanT('dayOverview')}</h2>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 px-3 py-1 text-sm font-semibold">
              {dayStats.calories} {mealPlanT('cal')}
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-3 py-1 text-sm font-semibold">
              {dayStats.protein.toFixed(1)}g {mealPlanT('protein')}
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-3 py-1 text-sm font-semibold">
              {meals.length} {mealPlanT('meals')}
            </Badge>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onRegeneratePlan}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-4 py-2 rounded-lg font-semibold text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {mealPlanT('shuffleMeals')}
          </Button>
        </div>
      </div>

      {/* Compact Meals Display - Organized by Type */}
      <div className="space-y-3">
        {Object.entries(mealsByType).map(([mealType, mealList]) => {
          if (mealList.length === 0 && mealType !== 'snack') return null;
          
          return (
            <Card key={mealType} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                {/* Meal Type Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-6 rounded-full bg-gradient-to-b ${getMealTypeColor(mealType)}`}></div>
                    <h3 className="text-lg font-bold text-slate-800 capitalize">
                      {mealPlanT(mealType as any)}
                    </h3>
                    <span className="text-sm text-slate-500 font-medium">
                      {mealList.length} {mealList.length === 1 ? mealPlanT('item') : mealPlanT('items')}
                    </span>
                  </div>
                </div>

                {mealList.length > 0 ? (
                  <div className="space-y-3">
                    {mealList.map((meal, index) => (
                      <div key={`${meal.id}-${index}`} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between gap-3">
                          {/* Meal Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs font-semibold px-2 py-1 ${getMealTypeBadgeColor(mealType)}`}
                              >
                                {mealPlanT(mealType as any)}
                              </Badge>
                              {meal.prep_time && (
                                <div className="flex items-center gap-1 text-xs text-slate-600">
                                  <Clock className="w-3 h-3" />
                                  <span>{meal.prep_time} {mealPlanT('minutes')}</span>
                                </div>
                              )}
                            </div>
                            
                            <h4 className="font-semibold text-slate-800 text-sm mb-2 truncate">
                              {meal.name}
                            </h4>

                            {/* Compact Nutrition Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center bg-red-50 rounded p-1.5 border border-red-100">
                                <div className="font-bold text-red-600">{Math.round(meal.calories || 0)}</div>
                                <div className="text-red-500 font-medium">{mealPlanT('cal')}</div>
                              </div>
                              <div className="text-center bg-blue-50 rounded p-1.5 border border-blue-100">
                                <div className="font-bold text-blue-600">{Math.round(meal.protein || 0)}g</div>
                                <div className="text-blue-500 font-medium">{mealPlanT('protein')}</div>
                              </div>
                              <div className="text-center bg-green-50 rounded p-1.5 border border-green-100">
                                <div className="font-bold text-green-600">{Math.round(meal.carbs || 0)}g</div>
                                <div className="text-green-500 font-medium">{mealPlanT('carbs')}</div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-1 shrink-0">
                            <Button
                              onClick={() => onShowRecipe(meal)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 font-medium px-2 py-1 h-7 text-xs"
                            >
                              <Book className="w-3 h-3 mr-1" />
                              {mealPlanT('recipe')}
                            </Button>
                            <Button
                              onClick={() => onExchangeMeal(meal)}
                              variant="outline"
                              size="sm"
                              className="text-purple-600 border-purple-200 hover:bg-purple-50 font-medium px-2 py-1 h-7 text-xs"
                            >
                              <ArrowLeftRight className="w-3 h-3 mr-1" />
                              {mealPlanT('exchange')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : mealType === 'snack' ? (
                  <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 rounded-lg">
                    <CardContent className="p-4 text-center">
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium text-sm">{mealPlanT('noMealsPlanned')}</p>
                    </CardContent>
                  </Card>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MealGrid;
