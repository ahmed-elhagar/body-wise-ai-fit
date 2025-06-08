import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from "date-fns";
import { ChefHat, ArrowLeftRight, Plus, Calendar, Utensils } from "lucide-react";
import type { DailyMeal } from "@/features/meal-plan/types";

interface WeeklyViewContainerProps {
  weekStartDate: Date;
  currentWeekPlan: {
    weeklyPlan: any;
    dailyMeals: DailyMeal[];
  };
  onSelectDay: (dayNumber: number) => void;
  onSwitchToDaily: () => void;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
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
  
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  const getMealsForDay = (dayNumber: number) => {
    return currentWeekPlan.dailyMeals.filter(meal => meal.day_number === dayNumber);
  };

  const getDayCalories = (dayNumber: number) => {
    const dayMeals = getMealsForDay(dayNumber);
    return dayMeals.reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  const handleDayClick = (dayNumber: number) => {
    onSelectDay(dayNumber);
    onSwitchToDaily();
  };

  const mealTypeColors = {
    breakfast: 'bg-orange-100 border-orange-300 text-orange-700',
    lunch: 'bg-green-100 border-green-300 text-green-700',
    dinner: 'bg-blue-100 border-blue-300 text-blue-700',
    snack1: 'bg-purple-100 border-purple-300 text-purple-700',
    snack2: 'bg-pink-100 border-pink-300 text-pink-700',
    snack: 'bg-purple-100 border-purple-300 text-purple-700'
  };

  return (
    <div className="space-y-4">
      {/* Week Summary */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Overview - {format(weekStartDate, 'MMM d')} to {format(addDays(weekStartDate, 6), 'MMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-fitness-primary-700">
                {currentWeekPlan.dailyMeals.length}
              </div>
              <div className="text-sm text-fitness-primary-600">Total Meals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {Math.round(currentWeekPlan.weeklyPlan.total_calories / 7)}
              </div>
              <div className="text-sm text-green-600">Avg Daily Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round((currentWeekPlan.weeklyPlan.total_protein || 0) / 7)}g
              </div>
              <div className="text-sm text-blue-600">Avg Daily Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-700">7</div>
              <div className="text-sm text-orange-600">Days Planned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
          const dayMeals = getMealsForDay(dayNumber);
          const dayCalories = getDayCalories(dayNumber);
          const dayDate = getDateForDay(dayNumber);

          return (
            <Card 
              key={dayNumber} 
              className="hover:shadow-md transition-shadow cursor-pointer border-fitness-primary-100 hover:border-fitness-primary-300"
              onClick={() => handleDayClick(dayNumber)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <div>
                    <div className="font-bold text-fitness-primary-800">
                      {getDayName(dayNumber)}
                    </div>
                    <div className="text-xs text-fitness-primary-600 font-normal">
                      {format(dayDate, 'MMM d')}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {dayCalories} cal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {dayMeals.length > 0 ? (
                    dayMeals.slice(0, 3).map((meal, index) => (
                      <div 
                        key={meal.id} 
                        className="p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Badge 
                            className={`text-xs px-2 py-0.5 ${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-100 border-gray-300 text-gray-700'}`}
                          >
                            {meal.meal_type}
                          </Badge>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowRecipe(meal);
                              }}
                              className="h-5 w-5 p-0 bg-indigo-500 hover:bg-indigo-600 text-white"
                            >
                              <ChefHat className="w-2.5 h-2.5" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onExchangeMeal(meal);
                              }}
                              className="h-5 w-5 p-0 bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              <ArrowLeftRight className="w-2.5 h-2.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-gray-800 truncate">
                          {meal.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {meal.calories} cal • {meal.protein}g protein
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-gray-500">
                      <Utensils className="w-6 h-6 mx-auto mb-2 opacity-50" />
                      <div className="text-xs">No meals planned</div>
                    </div>
                  )}
                  
                  {dayMeals.length > 3 && (
                    <div className="text-center text-xs text-gray-500">
                      +{dayMeals.length - 3} more meals
                    </div>
                  )}

                  {/* Add Snack Button */}
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddSnack(dayNumber);
                    }}
                    className="w-full h-6 text-xs bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Snack
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Click to view details hint */}
      <div className="text-center text-sm text-gray-500 mt-4">
        Click on any day to view detailed meal plan and nutrition information
      </div>
    </div>
  );
};

export default WeeklyViewContainer;
