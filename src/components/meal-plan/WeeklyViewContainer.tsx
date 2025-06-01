
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, ChefHat, Plus } from "lucide-react";
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
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className={`text-2xl font-bold flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Eye className="w-6 h-6 text-fitness-primary-600" />
          {weeklyView}
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
                className={`cursor-pointer hover:shadow-xl transition-all duration-300 bg-white group border-2 hover:border-fitness-primary-300 ${
                  isToday ? 'ring-2 ring-fitness-accent-400 border-fitness-accent-300' : 'border-gray-100'
                }`}
                onClick={() => {
                  onSelectDay(day.number);
                  onSwitchToDaily();
                }}
              >
                <CardHeader className="pb-3">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <CardTitle className="text-lg font-semibold text-fitness-primary-800">
                        {getDayName(day.number)}
                      </CardTitle>
                      <p className="text-sm text-fitness-primary-500">
                        {format(day.date, 'MMM d')}
                      </p>
                    </div>
                    <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
                      <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 font-medium">
                        {dayStats.calories} {cal}
                      </Badge>
                      {isToday && (
                        <p className="text-xs text-fitness-accent-600 font-semibold mt-1">
                          {today}
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
                      <div className="text-fitness-primary-500">{meals}</div>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-700">{dayStats.protein.toFixed(0)}g</div>
                      <div className="text-blue-500">{protein}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-700">{dayStats.carbs.toFixed(0)}g</div>
                      <div className="text-green-500">{carbs}</div>
                    </div>
                  </div>

                  {/* Meals Preview */}
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {dayMeals.slice(0, 2).map((meal: DailyMeal, index: number) => (
                      <div 
                        key={meal.id} 
                        className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowRecipe(meal);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm text-gray-900 line-clamp-1">
                              {meal.name}
                            </h5>
                            <p className="text-xs text-gray-500">{meal.meal_type}</p>
                          </div>
                          <span className="text-xs font-medium text-fitness-primary-600">
                            {meal.calories || 0} {cal}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {dayMeals.length > 2 && (
                      <div className="text-center text-xs text-fitness-primary-500">
                        +{dayMeals.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-fitness-primary-600 hover:bg-fitness-primary-50 border-fitness-primary-200"
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
                      className="w-full text-green-600 hover:bg-green-50 border-green-200"
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
