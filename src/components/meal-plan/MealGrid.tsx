
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Book, ArrowLeftRight, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MealGridProps {
  meals: any[];
  onShowRecipe: (meal: any) => void;
  onExchangeMeal: (meal: any) => void;
  onAddSnack: () => void;
  dayNumber: number;
}

const MealGrid = ({
  meals,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack,
  dayNumber
}: MealGridProps) => {
  const { t, isRTL } = useLanguage();

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
      {/* Day Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{t('mealPlan.dayOverview')}</h2>
        <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Badge className="bg-red-100 text-red-700 px-2 lg:px-3 py-1 text-xs lg:text-sm">
            {dayStats.calories} {t('mealPlan.cal')}
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 px-2 lg:px-3 py-1 text-xs lg:text-sm">
            {dayStats.protein.toFixed(1)}g {t('mealPlan.protein')}
          </Badge>
          <Badge className="bg-green-100 text-green-700 px-2 lg:px-3 py-1 text-xs lg:text-sm">
            {meals.length} {t('mealPlan.meals')}
          </Badge>
        </div>
      </div>

      {/* Meals by Type */}
      <div className="space-y-4 lg:space-y-6">
        {Object.entries(mealsByType).map(([mealType, mealList]) => {
          if (mealList.length === 0 && mealType !== 'snack') return null;
          
          return (
            <div key={mealType} className="space-y-3 lg:space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900">
                  {t(`mealPlan.${mealType}`)}
                </h3>
                {mealType === 'snack' && (
                  <Button
                    onClick={onAddSnack}
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50 text-xs lg:text-sm"
                  >
                    <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                    {t('mealPlan.addSnack')}
                  </Button>
                )}
              </div>

              {mealList.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                  {mealList.map((meal, index) => (
                    <Card key={`${meal.id}-${index}`} className="hover:shadow-lg transition-all duration-200 shadow-sm rounded-xl group border-0 bg-white">
                      <CardContent className="p-3 lg:p-4">
                        <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <h4 className={`font-semibold text-gray-900 flex-1 text-base lg:text-lg ${isRTL ? 'ml-3 text-right' : 'mr-3'}`}>
                            {meal.name}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-medium ${
                              mealType === 'breakfast' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              mealType === 'lunch' ? 'bg-green-100 text-green-700 border-green-200' :
                              mealType === 'dinner' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                              'bg-purple-100 text-purple-700 border-purple-200'
                            }`}
                          >
                            {t(`mealPlan.${mealType}`)}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mb-3 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-red-600">{Math.round(meal.calories || 0)}</div>
                            <div className="text-xs text-gray-500">{t('mealPlan.cal')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-blue-600">{Math.round(meal.protein || 0)}g</div>
                            <div className="text-xs text-gray-500">{t('mealPlan.protein')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-600">{Math.round(meal.carbs || 0)}g</div>
                            <div className="text-xs text-gray-500">{t('mealPlan.carbs')}</div>
                          </div>
                        </div>

                        {meal.prep_time && (
                          <div className={`flex items-center gap-2 text-xs text-gray-500 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Clock className="w-3 h-3" />
                            <span>{meal.prep_time} {t('mealPlan.minutes')}</span>
                          </div>
                        )}

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Button
                            onClick={() => onShowRecipe(meal)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50 text-xs lg:text-sm"
                          >
                            <Book className="w-3 h-3 mr-1" />
                            {t('mealPlan.recipe')}
                          </Button>
                          <Button
                            onClick={() => onExchangeMeal(meal)}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-purple-600 border-purple-200 hover:bg-purple-50 text-xs lg:text-sm"
                          >
                            <ArrowLeftRight className="w-3 h-3 mr-1" />
                            {t('mealPlan.exchange')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : mealType === 'snack' ? (
                <Card className="border-dashed border-2 border-gray-200 bg-gray-50 rounded-xl">
                  <CardContent className="p-4 lg:p-6 text-center">
                    <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 mb-3 text-sm lg:text-base">{t('mealPlan.noMealsPlanned')}</p>
                    <Button
                      onClick={onAddSnack}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50 text-xs lg:text-sm"
                    >
                      {t('mealPlan.addSnack')}
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
