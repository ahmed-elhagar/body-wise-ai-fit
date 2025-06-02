
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, ArrowLeftRight, Plus, Calendar, Target } from "lucide-react";
import { format } from "date-fns";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface DayOverviewProps {
  selectedDayNumber: number;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: () => void;
  weekStartDate: Date;
}

const DayOverview = ({
  selectedDayNumber,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  onViewMeal,
  onExchangeMeal,
  onAddSnack,
  weekStartDate
}: DayOverviewProps) => {
  
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + dayOffset);
    return date;
  };

  const mealTypeColors = {
    breakfast: 'bg-orange-100 border-orange-300 text-orange-700',
    lunch: 'bg-green-100 border-green-300 text-green-700',
    dinner: 'bg-blue-100 border-blue-300 text-blue-700',
    snack1: 'bg-purple-100 border-purple-300 text-purple-700',
    snack2: 'bg-pink-100 border-pink-300 text-pink-700',
    snack: 'bg-purple-100 border-purple-300 text-purple-700'
  };

  const progressPercentage = Math.min(100, (totalCalories / targetDayCalories) * 100);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-fitness-primary-600" />
              <div>
                <h2 className="text-xl font-bold text-fitness-primary-800">
                  {getDayName(selectedDayNumber)}
                </h2>
                <p className="text-sm text-fitness-primary-600">
                  {format(getDateForDay(selectedDayNumber), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <Button
              onClick={onAddSnack}
              className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Snack
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Nutrition Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
              <div className="text-sm text-gray-600">Calories</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {remainingCalories} remaining of {targetDayCalories}
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
              <div className="text-sm text-gray-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{dailyMeals.length}</div>
              <div className="text-sm text-gray-600">Meals Planned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      <div className="space-y-4">
        {dailyMeals.length > 0 ? (
          dailyMeals.map((meal) => (
            <Card key={meal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        className={`${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-100 border-gray-300 text-gray-700'}`}
                      >
                        {meal.meal_type}
                      </Badge>
                      <h3 className="font-semibold text-lg">{meal.name}</h3>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{meal.calories} cal</span>
                      <span>{meal.protein}g protein</span>
                      <span>{meal.carbs}g carbs</span>
                      <span>{meal.fat}g fat</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onViewMeal(meal)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      <ChefHat className="w-4 h-4 mr-1" />
                      Recipe
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onExchangeMeal(meal)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <ArrowLeftRight className="w-4 h-4 mr-1" />
                      Exchange
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No meals planned for this day</h3>
              <p className="text-gray-600 mb-4">Start by adding a snack or generating a meal plan</p>
              <Button onClick={onAddSnack} className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Snack
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DayOverview;
