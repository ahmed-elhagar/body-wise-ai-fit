
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

  return (
    <div className="space-y-6">
      {/* Day Header with Stats */}
      <div className="bg-gradient-to-r from-white to-slate-50 rounded-2xl p-6 shadow-lg border border-slate-200/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">{mealPlanT('dayOverview')}</h2>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 px-4 py-2 text-sm font-semibold">
              {dayStats.calories} {mealPlanT('cal')}
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 px-4 py-2 text-sm font-semibold">
              {dayStats.protein.toFixed(1)}g {mealPlanT('protein')}
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-4 py-2 text-sm font-semibold">
              {meals.length} {mealPlanT('meals')}
            </Badge>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={onRegeneratePlan}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {mealPlanT('shuffleMeals')}
          </Button>
        </div>
      </div>

      {/* Meals by Type */}
      <div className="space-y-8">
        {Object.entries(mealsByType).map(([mealType, mealList]) => {
          if (mealList.length === 0 && mealType !== 'snack') return null;
          
          return (
            <div key={mealType} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl lg:text-2xl font-bold text-slate-800 capitalize flex items-center gap-3">
                  <div className={`w-3 h-8 rounded-full ${
                    mealType === 'breakfast' ? 'bg-gradient-to-b from-orange-400 to-amber-500' :
                    mealType === 'lunch' ? 'bg-gradient-to-b from-green-400 to-emerald-500' :
                    mealType === 'dinner' ? 'bg-gradient-to-b from-blue-400 to-indigo-500' :
                    'bg-gradient-to-b from-purple-400 to-pink-500'
                  }`}></div>
                  {mealPlanT(mealType as any)}
                </h3>
                <div className="text-sm text-slate-500 font-medium">
                  {mealList.length} {mealList.length === 1 ? mealPlanT('item') : mealPlanT('items')}
                </div>
              </div>

              {mealList.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mealList.map((meal, index) => (
                    <Card key={`${meal.id}-${index}`} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden rounded-2xl hover:scale-105 transform">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-bold text-slate-800 flex-1 text-lg mr-3 line-clamp-2 leading-tight">
                            {meal.name}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-semibold shrink-0 border-2 px-3 py-1 ${
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
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-3 border border-red-100">
                            <div className="font-bold text-red-600 text-lg">{Math.round(meal.calories || 0)}</div>
                            <div className="text-xs text-red-500 font-medium">{mealPlanT('cal')}</div>
                          </div>
                          <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
                            <div className="font-bold text-blue-600 text-lg">{Math.round(meal.protein || 0)}g</div>
                            <div className="text-xs text-blue-500 font-medium">{mealPlanT('protein')}</div>
                          </div>
                          <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                            <div className="font-bold text-green-600 text-lg">{Math.round(meal.carbs || 0)}g</div>
                            <div className="text-xs text-green-500 font-medium">{mealPlanT('carbs')}</div>
                          </div>
                        </div>

                        {/* Prep Time */}
                        {meal.prep_time && (
                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-50 rounded-lg p-2">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{meal.prep_time} {mealPlanT('minutes')}</span>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Button
                            onClick={() => onShowRecipe(meal)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 font-medium"
                          >
                            <Book className="w-4 h-4 mr-1" />
                            {mealPlanT('recipe')}
                          </Button>
                          <Button
                            onClick={() => onExchangeMeal(meal)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 font-medium"
                          >
                            <ArrowLeftRight className="w-4 h-4 mr-1" />
                            {mealPlanT('exchange')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : mealType === 'snack' ? (
                <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">{mealPlanT('noMealsPlanned')}</p>
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
