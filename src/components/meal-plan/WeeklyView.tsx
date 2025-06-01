
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Activity, ChefHat, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface WeeklyViewProps {
  weekStartDate: Date;
  currentWeekPlan: any;
  onSelectDay: (dayNumber: number) => void;
  onSwitchToDaily: () => void;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, dayNumber: number, mealIndex: number) => void;
  onAddSnack: (dayNumber: number) => void;
}

const WeeklyView = ({
  weekStartDate,
  currentWeekPlan,
  onSelectDay,
  onSwitchToDaily,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack
}: WeeklyViewProps) => {
  const { t, isRTL } = useLanguage();

  const weekDays = [
    { number: 1, nameKey: 'mealPlan.dayNames.1', date: weekStartDate },
    { number: 2, nameKey: 'mealPlan.dayNames.2', date: addDays(weekStartDate, 1) },
    { number: 3, nameKey: 'mealPlan.dayNames.3', date: addDays(weekStartDate, 2) },
    { number: 4, nameKey: 'mealPlan.dayNames.4', date: addDays(weekStartDate, 3) },
    { number: 5, nameKey: 'mealPlan.dayNames.5', date: addDays(weekStartDate, 4) },
    { number: 6, nameKey: 'mealPlan.dayNames.6', date: addDays(weekStartDate, 5) },
    { number: 7, nameKey: 'mealPlan.dayNames.7', date: addDays(weekStartDate, 6) }
  ];

  const getDayMeals = (dayNumber: number) => {
    return currentWeekPlan?.dailyMeals?.filter(
      (meal: DailyMeal) => meal.day_number === dayNumber
    ) || [];
  };

  const calculateDayStats = (dayMeals: DailyMeal[]) => {
    return dayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'lunch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dinner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'snack1':
      case 'snack2': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="shadow-lg rounded-2xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className={`text-2xl font-bold flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Eye className="w-6 h-6 text-fitness-primary-600" />
          {t('mealPlan.weeklyView')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {weekDays.map((day) => {
            const dayMeals = getDayMeals(day.number);
            const dayStats = calculateDayStats(dayMeals);
            const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <Card 
                key={day.number} 
                className={`cursor-pointer hover:shadow-xl transition-all duration-300 bg-white rounded-2xl group border-2 hover:border-fitness-primary-300 ${
                  isToday ? 'ring-2 ring-fitness-accent-400 border-fitness-accent-300' : 'border-gray-100'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <CardTitle className="text-lg font-semibold text-fitness-primary-800">
                        {t(day.nameKey)}
                      </CardTitle>
                      <p className="text-sm text-fitness-primary-500">
                        {format(day.date, 'MMM d')}
                      </p>
                    </div>
                    <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
                      <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 font-medium">
                        {dayStats.calories} {t('mealPlan.cal')}
                      </Badge>
                      {isToday && (
                        <p className="text-xs text-fitness-accent-600 font-semibold mt-1">
                          {t('mealPlan.today')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-fitness-primary-50 rounded-lg">
                      <div className="font-semibold text-fitness-primary-700">{dayMeals.length}</div>
                      <div className="text-fitness-primary-500">{t('mealPlan.meals')}</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-700">{dayStats.protein.toFixed(0)}g</div>
                      <div className="text-blue-500">{t('mealPlan.protein')}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-700">{dayStats.carbs.toFixed(0)}g</div>
                      <div className="text-green-500">{t('mealPlan.carbs')}</div>
                    </div>
                  </div>

                  {/* Meals Preview */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {dayMeals.slice(0, 3).map((meal: DailyMeal, index: number) => (
                      <div 
                        key={meal.id} 
                        className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group/meal"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowRecipe(meal);
                        }}
                      >
                        <div className={`flex items-start justify-between mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs mb-1 ${getMealTypeColor(meal.meal_type)}`}
                            >
                              {t(`mealPlan.mealTypes.${meal.meal_type}`)}
                            </Badge>
                            <h5 className="font-medium text-sm text-gray-900 line-clamp-1">
                              {meal.name}
                            </h5>
                          </div>
                          <span className="text-xs font-medium text-fitness-primary-600 ml-2">
                            {meal.calories || 0} {t('mealPlan.cal')}
                          </span>
                        </div>
                        
                        <div className={`flex gap-1 opacity-0 group-hover/meal:opacity-100 transition-opacity ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-6 text-xs hover:bg-blue-50 border-blue-200 text-blue-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShowRecipe(meal);
                            }}
                          >
                            <ChefHat className="w-3 h-3 mr-1" />
                            {t('mealPlan.recipe')}
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {dayMeals.length > 3 && (
                      <div className="text-center text-xs text-fitness-primary-500">
                        +{dayMeals.length - 3} {t('mealPlan.moreMeals')}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-fitness-primary-600 hover:bg-fitness-primary-50 border-fitness-primary-200"
                      onClick={() => {
                        onSelectDay(day.number);
                        onSwitchToDaily();
                      }}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      {t('mealPlan.viewDay')}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-green-600 hover:bg-green-50 border-green-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddSnack(day.number);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('mealPlan.addSnack')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyView;
