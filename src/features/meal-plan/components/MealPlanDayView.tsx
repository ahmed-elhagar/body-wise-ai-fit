
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, ArrowLeftRight, Plus, Calendar } from "lucide-react";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealPlanDayViewProps {
  dayNumber: number;
  weeklyPlan: {
    weeklyPlan: any;
    dailyMeals: DailyMeal[];
  };
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal) => void;
  onAddSnack: (dayNumber: number) => void;
}

const MealPlanDayView = ({
  dayNumber,
  weeklyPlan,
  onShowRecipe,
  onExchangeMeal,
  onAddSnack
}: MealPlanDayViewProps) => {
  
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber] || 'Day';
  };

  const getMealsForDay = (dayNumber: number) => {
    return weeklyPlan.dailyMeals.filter(meal => meal.day_number === dayNumber);
  };

  const dayMeals = getMealsForDay(dayNumber);
  const dayCalories = dayMeals.reduce((total, meal) => total + (meal.calories || 0), 0);

  const mealTypeColors = {
    breakfast: 'bg-orange-100 border-orange-300 text-orange-700',
    lunch: 'bg-green-100 border-green-300 text-green-700',
    dinner: 'bg-blue-100 border-blue-300 text-blue-700',
    snack1: 'bg-purple-100 border-purple-300 text-purple-700',
    snack2: 'bg-pink-100 border-pink-300 text-pink-700',
    snack: 'bg-purple-100 border-purple-300 text-purple-700'
  };

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {getDayName(dayNumber)} - Day {dayNumber}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-fitness-primary-600">
            <span>{dayMeals.length} meals planned</span>
            <span>{dayCalories} total calories</span>
          </div>
        </CardHeader>
      </Card>

      {/* Meals List */}
      <div className="space-y-4">
        {dayMeals.length > 0 ? (
          dayMeals.map((meal) => (
            <Card key={meal.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge 
                    className={`text-sm px-3 py-1 ${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-100 border-gray-300 text-gray-700'}`}
                  >
                    {meal.meal_type}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onShowRecipe(meal)}
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
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {meal.name}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Calories:</span>
                    <div className="font-medium">{meal.calories}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Protein:</span>
                    <div className="font-medium">{meal.protein}g</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Carbs:</span>
                    <div className="font-medium">{meal.carbs}g</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Fat:</span>
                    <div className="font-medium">{meal.fat}g</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center p-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No meals planned for this day
              </h3>
              <p className="text-gray-600 mb-4">
                Add some meals to get started with your nutrition plan.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Snack Button */}
      <div className="text-center">
        <Button
          onClick={() => onAddSnack(dayNumber)}
          className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Snack to This Day
        </Button>
      </div>
    </div>
  );
};

export default MealPlanDayView;
