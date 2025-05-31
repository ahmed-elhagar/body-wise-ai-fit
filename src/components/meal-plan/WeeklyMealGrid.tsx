
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Book, ArrowLeftRight } from "lucide-react";
import { format, addDays } from "date-fns";
import type { DailyMeal } from "@/hooks/useMealPlanData";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface WeeklyMealGridProps {
  currentWeekPlan: {
    weeklyPlan: any;
    dailyMeals: DailyMeal[];
  };
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index?: number) => void;
  weekStartDate: Date;
}

const WeeklyMealGrid = ({
  currentWeekPlan,
  onViewMeal,
  onExchangeMeal,
  weekStartDate
}: WeeklyMealGridProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  const getDayName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  // Group meals by day
  const mealsByDay = currentWeekPlan.dailyMeals.reduce((acc, meal) => {
    if (!acc[meal.day_number]) {
      acc[meal.day_number] = [];
    }
    acc[meal.day_number].push(meal);
    return acc;
  }, {} as Record<number, DailyMeal[]>);

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="space-y-6">
      {days.map(dayNumber => {
        const dayMeals = mealsByDay[dayNumber] || [];
        const dayDate = getDateForDay(dayNumber);
        const dayStats = dayMeals.reduce((acc, meal) => ({
          calories: acc.calories + (meal.calories || 0),
          protein: acc.protein + (meal.protein || 0)
        }), { calories: 0, protein: 0 });

        return (
          <Card key={dayNumber} className="shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {getDayName(dayNumber)} - {format(dayDate, 'MMM d')}
                  </h3>
                  <p className="text-gray-600">{dayMeals.length} meals planned</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    {dayStats.calories} cal
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {dayStats.protein.toFixed(1)}g protein
                  </Badge>
                </div>
              </div>

              {dayMeals.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dayMeals.map((meal, index) => (
                    <Card key={meal.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {meal.meal_type}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {meal.prep_time + meal.cook_time}min
                          </span>
                        </div>
                        
                        <h4 className="font-semibold text-sm mb-2 text-gray-800 line-clamp-2">
                          {meal.name}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="text-center bg-red-50 rounded p-1">
                            <div className="font-bold text-red-600">{meal.calories}</div>
                            <div className="text-red-500">cal</div>
                          </div>
                          <div className="text-center bg-blue-50 rounded p-1">
                            <div className="font-bold text-blue-600">{meal.protein}g</div>
                            <div className="text-blue-500">protein</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            onClick={() => onViewMeal(meal)}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 h-6 flex-1"
                          >
                            <Book className="w-3 h-3 mr-1" />
                            Recipe
                          </Button>
                          <Button
                            onClick={() => onExchangeMeal(meal, index)}
                            variant="outline"
                            size="sm"
                            className="text-xs px-2 py-1 h-6 flex-1"
                          >
                            <ArrowLeftRight className="w-3 h-3 mr-1" />
                            Exchange
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No meals planned for this day</p>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default WeeklyMealGrid;
