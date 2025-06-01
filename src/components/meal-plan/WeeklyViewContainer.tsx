
import { format, addDays, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ChefHat, Plus, Utensils, ArrowRight, Book, ArrowLeftRight } from "lucide-react";
import { useMealPlanTranslations } from "@/utils/mealPlanTranslations";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface WeeklyViewContainerProps {
  weekStartDate: Date;
  currentWeekPlan: any;
  onSelectDay: (dayNumber: number) => void;
  onSwitchToDaily: () => void;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, dayNumber: number, mealIndex: number) => void;
  onAddSnack: (dayNumber: number) => void;
}

const WeeklyViewContainer = ({
  weekStartDate,
  currentWeekPlan,
  onSelectDay,
  onSwitchToDaily,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack
}: WeeklyViewContainerProps) => {
  const { 
    weeklyView, 
    cal, 
    meals, 
    protein, 
    carbs, 
    viewDay, 
    addSnack, 
    recipe,
    today,
    isRTL 
  } = useMealPlanTranslations();

  const weekDays = [
    { number: 1, date: weekStartDate },
    { number: 2, date: addDays(weekStartDate, 1) },
    { number: 3, date: addDays(weekStartDate, 2) },
    { number: 4, date: addDays(weekStartDate, 3) },
    { number: 5, date: addDays(weekStartDate, 4) },
    { number: 6, date: addDays(weekStartDate, 5) },
    { number: 7, date: addDays(weekStartDate, 6) }
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

  const getDayName = (dayNumber: number) => {
    const dayNames = {
      1: 'Saturday',
      2: 'Sunday',
      3: 'Monday',
      4: 'Tuesday', 
      5: 'Wednesday',
      6: 'Thursday',
      7: 'Friday'
    };
    return dayNames[dayNumber as keyof typeof dayNames] || 'Unknown';
  };

  return (
    <Card className="bg-white border-fitness-primary-100 shadow-sm rounded-xl">
      <CardHeader className="pb-4 bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 rounded-t-xl border-b border-fitness-primary-100">
        <CardTitle className={`text-2xl font-bold flex items-center gap-3 text-fitness-primary-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-10 h-10 bg-fitness-primary-500 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span>{weeklyView || 'Weekly Overview'}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {weekDays.map((day) => {
            const dayMeals = getDayMeals(day.number);
            const dayStats = calculateDayStats(dayMeals);
            const isToday = isSameDay(day.date, new Date());

            return (
              <Card 
                key={day.number} 
                className={`cursor-pointer transition-all duration-300 bg-white group border-2 hover:shadow-lg hover:scale-102 ${
                  isToday ? 'ring-2 ring-fitness-accent-400 border-fitness-accent-300' : 'border-fitness-primary-100 hover:border-fitness-primary-300'
                } rounded-xl overflow-hidden`}
                onClick={() => {
                  onSelectDay(day.number);
                  onSwitchToDaily();
                }}
              >
                <CardHeader className={`pb-3 ${isToday ? 'bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white' : 'bg-fitness-primary-500 text-white'}`}>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <CardTitle className="text-lg font-bold">
                        {getDayName(day.number)}
                      </CardTitle>
                      <p className="text-sm opacity-90">
                        {format(day.date, 'MMM d')}
                      </p>
                    </div>
                    <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
                      <Badge className="bg-white/20 text-white border-white/30 font-medium">
                        {dayStats.calories} {cal || 'cal'}
                      </Badge>
                      {isToday && (
                        <p className="text-xs font-medium mt-1 opacity-90">
                          {today || 'Today'}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 space-y-3">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-fitness-primary-50 rounded-lg">
                      <div className="font-bold text-sm text-fitness-primary-700">{dayMeals.length}</div>
                      <div className="text-fitness-primary-600">{meals || 'meals'}</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="font-bold text-sm text-blue-700">{dayStats.protein.toFixed(0)}g</div>
                      <div className="text-blue-600">{protein || 'protein'}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="font-bold text-sm text-green-700">{dayStats.carbs.toFixed(0)}g</div>
                      <div className="text-green-600">{carbs || 'carbs'}</div>
                    </div>
                  </div>

                  {/* Meals Preview */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {dayMeals.slice(0, 2).map((meal: DailyMeal, index: number) => (
                      <div 
                        key={meal.id} 
                        className="p-2 bg-gray-50 rounded-lg hover:bg-fitness-primary-50 transition-colors group/meal"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Utensils className="w-3 h-3 text-fitness-primary-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-medium text-xs text-gray-900 truncate">
                                {meal.name}
                              </h5>
                              <p className="text-xs text-gray-500 capitalize">{meal.meal_type}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-fitness-primary-600 bg-fitness-primary-100 px-2 py-1 rounded flex-shrink-0">
                            {meal.calories || 0}
                          </span>
                        </div>
                        
                        {/* Meal Actions */}
                        <div className="flex gap-1 opacity-0 group-hover/meal:opacity-100 transition-opacity mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-6 text-xs hover:bg-blue-50 border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShowRecipe(meal);
                            }}
                          >
                            <Book className="w-3 h-3 mr-1" />
                            Recipe
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-6 text-xs hover:bg-orange-50 border-orange-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onExchangeMeal(meal, day.number, index);
                            }}
                          >
                            <ArrowLeftRight className="w-3 h-3 mr-1" />
                            Exchange
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {dayMeals.length > 2 && (
                      <div className="text-center text-xs text-fitness-primary-600 font-medium bg-fitness-primary-50 py-2 rounded-lg">
                        +{dayMeals.length - 2} more
                      </div>
                    )}
                    
                    {dayMeals.length === 0 && (
                      <div className="text-center text-gray-400 py-3">
                        <ChefHat className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">No meals planned</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-fitness-primary-700 hover:bg-fitness-primary-50 border-fitness-primary-200 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(day.number);
                        onSwitchToDaily();
                      }}
                    >
                      <Calendar className="w-3 h-3 mr-1" />
                      {viewDay || 'View Day'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-green-700 hover:bg-green-50 border-green-200 h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddSnack(day.number);
                      }}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {addSnack || 'Add Snack'}
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

export default WeeklyViewContainer;
