
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Utensils, Flame, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Meal } from "@/types/meal";

interface WeeklyMealPlanViewProps {
  weeklyPlan: any;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, dayNumber: number, mealIndex: number) => void;
}

const WeeklyMealPlanView = ({ weeklyPlan, onShowRecipe, onExchangeMeal }: WeeklyMealPlanViewProps) => {
  const { t, isRTL } = useLanguage();
  
  const dayNames = [
    t('day.monday'), t('day.tuesday'), t('day.wednesday'), 
    t('day.thursday'), t('day.friday'), t('day.saturday'), t('day.sunday')
  ];
  
  const getDietType = () => {
    if (!weeklyPlan?.dailyMeals?.length) return t('mealPlan.balanced');
    
    const allIngredients = weeklyPlan.dailyMeals
      .flatMap((meal: any) => meal.ingredients || [])
      .map((ing: any) => (typeof ing === 'string' ? ing : ing.name || '').toLowerCase());
    
    const hasAnimalProducts = allIngredients.some((ing: string) => 
      ing.includes('meat') || ing.includes('chicken') || ing.includes('beef') || 
      ing.includes('pork') || ing.includes('fish') || ing.includes('salmon') ||
      ing.includes('tuna') || ing.includes('dairy') || ing.includes('cheese') ||
      ing.includes('milk') || ing.includes('egg')
    );
    
    const hasHighProtein = weeklyPlan.dailyMeals.some((meal: any) => (meal.protein || 0) > 25);
    const hasLowCarb = weeklyPlan.dailyMeals.some((meal: any) => (meal.carbs || 0) < 10);
    
    if (!hasAnimalProducts) return t('mealPlan.vegetarian');
    if (hasLowCarb && hasHighProtein) return t('mealPlan.keto');
    if (hasHighProtein) return t('mealPlan.highProtein');
    return t('mealPlan.balanced');
  };

  const getDietTypeColor = (dietType: string) => {
    if (dietType.includes('Vegetarian') || dietType.includes('نباتي')) return 'bg-green-100 text-green-800 border-green-200';
    if (dietType.includes('Keto') || dietType.includes('كيتو')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (dietType.includes('High Protein') || dietType.includes('عالي البروتين')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMealsByDay = (dayNumber: number) => {
    return weeklyPlan?.dailyMeals?.filter((meal: any) => meal.day_number === dayNumber) || [];
  };

  const getMealTypeIcon = (mealType: string, mealName: string) => {
    if (mealName.includes('🍎')) return '🍎';
    switch (mealType.toLowerCase()) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const dietType = getDietType();
  const weeklyCalories = weeklyPlan?.weeklyPlan?.total_calories || 0;
  const weeklyProtein = weeklyPlan?.weeklyPlan?.total_protein || 0;

  return (
    <div className="space-y-6">
      {/* Enhanced Diet Type Header */}
      <Card className="p-6 bg-gradient-to-br from-fitness-primary/10 via-white to-pink-50 border-0 shadow-xl">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-fitness-gradient rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{t('mealPlan.weeklyMealPlan')}</h3>
              <p className="text-sm text-gray-600">{t('mealPlan.personalizedPlan')}</p>
            </div>
          </div>
          <div className={`flex flex-col items-end gap-2 ${isRTL ? 'items-start' : 'items-end'}`}>
            <Badge className={`${getDietTypeColor(dietType)} font-semibold px-4 py-2 text-sm`}>
              {dietType}
            </Badge>
            {weeklyCalories > 0 && (
              <div className="text-sm text-gray-600">
                {Math.round(weeklyCalories / 7)} {t('mealPlan.calPerDay')}
              </div>
            )}
          </div>
        </div>
        
        {/* Weekly Stats */}
        {(weeklyCalories > 0 || weeklyProtein > 0) && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Flame className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">{t('mealPlan.weeklyCalories')}</span>
              </div>
              <span className="text-2xl font-bold text-red-800">{weeklyCalories.toLocaleString()}</span>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">{t('mealPlan.weeklyProtein')}</span>
              </div>
              <span className="text-2xl font-bold text-green-800">{weeklyProtein}g</span>
            </div>
          </div>
        )}
      </Card>

      {/* Enhanced Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dayNames.map((dayName, index) => {
          const dayNumber = index + 1;
          const dayMeals = getMealsByDay(dayNumber);
          const dayCalories = dayMeals.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);
          const dayProtein = dayMeals.reduce((sum: number, meal: any) => sum + (meal.protein || 0), 0);
          
          return (
            <Card key={dayNumber} className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              {/* Day Header */}
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h4 className="text-lg font-bold text-gray-800 group-hover:text-fitness-primary transition-colors">
                  {dayName}
                </h4>
                <div className={`flex flex-col gap-1 ${isRTL ? 'items-start' : 'items-end'}`}>
                  <Badge variant="outline" className="bg-fitness-primary/10 text-fitness-primary font-semibold">
                    {dayCalories} {t('mealPlan.cal')}
                  </Badge>
                  {dayProtein > 0 && (
                    <span className="text-xs text-gray-600">{dayProtein}g {t('mealPlan.protein')}</span>
                  )}
                </div>
              </div>
              
              {/* Meals List */}
              <div className="space-y-4">
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal: any, mealIndex: number) => {
                    const isSnack = meal.name.includes('🍎');
                    
                    return (
                      <div key={mealIndex} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-fitness-primary/5 hover:to-pink-50 transition-all duration-200 group/meal">
                        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1">
                            {/* Meal Header */}
                            <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-lg">{getMealTypeIcon(meal.meal_type, meal.name)}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${isSnack ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
                              >
                                {isSnack ? t('mealPlan.snack') : t(`mealPlan.${meal.meal_type.toLowerCase()}`)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {(meal.prep_time || 0) + (meal.cook_time || 0)} {t('mealPlan.min')}
                              </span>
                            </div>
                            
                            {/* Meal Name */}
                            <h5 className="font-medium text-gray-800 text-sm mb-2 group-hover/meal:text-fitness-primary transition-colors">
                              {meal.name.replace('🍎 ', '')}
                            </h5>
                            
                            {/* Nutrition Grid */}
                            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                              <div className="bg-white/80 p-2 rounded text-center">
                                <span className="font-medium text-red-600">{meal.calories || 0}</span>
                                <div className="text-gray-500">{t('mealPlan.cal')}</div>
                              </div>
                              <div className="bg-white/80 p-2 rounded text-center">
                                <span className="font-medium text-green-600">{meal.protein || 0}g</span>
                                <div className="text-gray-500">{t('mealPlan.protein')}</div>
                              </div>
                              <div className="bg-white/80 p-2 rounded text-center">
                                <span className="font-medium text-blue-600">{meal.carbs || 0}g</span>
                                <div className="text-gray-500">{t('mealPlan.carbs')}</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className={`flex flex-col gap-2 ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 hover:bg-fitness-primary hover:text-white transition-all duration-200"
                              onClick={() => onShowRecipe({
                                ...meal,
                                type: meal.meal_type,
                                time: '08:00',
                                image: getMealTypeIcon(meal.meal_type, meal.name),
                                cookTime: meal.cook_time || 0,
                                prepTime: meal.prep_time || 0
                              })}
                            >
                              <ChefHat className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-2 hover:bg-orange-500 hover:text-white transition-all duration-200"
                              onClick={() => onExchangeMeal({
                                ...meal,
                                type: meal.meal_type,
                                time: '08:00',
                                image: getMealTypeIcon(meal.meal_type, meal.name),
                                cookTime: meal.cook_time || 0,
                                prepTime: meal.prep_time || 0
                              }, dayNumber, mealIndex)}
                            >
                              <span className="text-xs">⇄</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">{t('mealPlan.noMealsPlanned')}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyMealPlanView;
