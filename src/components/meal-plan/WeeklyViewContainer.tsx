
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ChefHat, Plus, Utensils } from "lucide-react";
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
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-fitness-primary-25 to-fitness-accent-25">
      <CardHeader className="pb-6 bg-gradient-to-r from-fitness-primary-600 to-fitness-accent-600 text-white rounded-t-lg">
        <CardTitle className={`text-3xl font-black flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-3 bg-white/20 rounded-full">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <span>{weeklyView}</span>
            <p className="text-fitness-primary-100 text-lg font-normal mt-1">
              Your week at a glance
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {weekDays.map((day) => {
            const dayMeals = getDayMeals(day.number);
            const dayStats = calculateDayStats(dayMeals);
            const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <Card 
                key={day.number} 
                className={`cursor-pointer hover:shadow-2xl transition-all duration-500 bg-white group border-2 hover:border-fitness-primary-400 hover:scale-105 ${
                  isToday ? 'ring-4 ring-fitness-accent-400 border-fitness-accent-400 shadow-xl' : 'border-fitness-primary-200 shadow-lg'
                } rounded-2xl overflow-hidden`}
                onClick={() => {
                  onSelectDay(day.number);
                  onSwitchToDaily();
                }}
              >
                <CardHeader className={`pb-4 ${isToday ? 'bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 text-white' : 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white'}`}>
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <CardTitle className="text-xl font-bold">
                        {getDayName(day.number)}
                      </CardTitle>
                      <p className="text-sm opacity-90 font-medium">
                        {format(day.date, 'MMM d')}
                      </p>
                    </div>
                    <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
                      <Badge className="bg-white/20 text-white border-white/30 font-bold text-sm">
                        {dayStats.calories} {cal}
                      </Badge>
                      {isToday && (
                        <p className="text-xs font-bold mt-2 opacity-90">
                          {today}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 p-6">
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="text-center p-3 bg-gradient-to-br from-fitness-primary-50 to-fitness-primary-100 rounded-xl border border-fitness-primary-200">
                      <div className="font-black text-lg text-fitness-primary-700">{dayMeals.length}</div>
                      <div className="text-fitness-primary-600 font-medium">{meals}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="font-black text-lg text-blue-700">{dayStats.protein.toFixed(0)}g</div>
                      <div className="text-blue-600 font-medium">{protein}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="font-black text-lg text-green-700">{dayStats.carbs.toFixed(0)}g</div>
                      <div className="text-green-600 font-medium">{carbs}</div>
                    </div>
                  </div>

                  {/* Enhanced Meals Preview */}
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {dayMeals.slice(0, 3).map((meal: DailyMeal, index: number) => (
                      <div 
                        key={meal.id} 
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-fitness-primary-50 hover:to-fitness-primary-100 transition-all duration-300 border border-gray-200 hover:border-fitness-primary-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowRecipe(meal);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 flex items-center gap-3">
                            <div className="p-2 bg-fitness-primary-100 rounded-lg">
                              <Utensils className="w-4 h-4 text-fitness-primary-600" />
                            </div>
                            <div>
                              <h5 className="font-bold text-sm text-gray-900 line-clamp-1">
                                {meal.name}
                              </h5>
                              <p className="text-xs text-gray-500 font-medium">{meal.meal_type}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-fitness-primary-600 bg-fitness-primary-100 px-2 py-1 rounded-lg">
                            {meal.calories || 0} {cal}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {dayMeals.length > 3 && (
                      <div className="text-center text-sm text-fitness-primary-600 font-bold bg-fitness-primary-50 py-2 rounded-xl">
                        +{dayMeals.length - 3} more meals
                      </div>
                    )}
                    
                    {dayMeals.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        <ChefHat className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No meals planned</p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-fitness-primary-700 hover:bg-fitness-primary-50 border-fitness-primary-300 font-bold rounded-xl h-11"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDay(day.number);
                        onSwitchToDaily();
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {viewDay}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-green-700 hover:bg-green-50 border-green-300 font-bold rounded-xl h-11"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddSnack(day.number);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {addSnack}
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
