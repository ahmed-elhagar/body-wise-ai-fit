
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Book, ArrowLeftRight } from "lucide-react";
import { format, addDays } from "date-fns";
import type { DailyMeal } from "@/hooks/useMealPlanData";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface DayOverviewProps {
  selectedDayNumber: number;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  onViewMeal: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index?: number) => void;
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
  const { mealPlanT } = useMealPlanTranslation();

  const getDayName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  const dayDate = getDateForDay(selectedDayNumber);

  return (
    <div className="space-y-6">
      {/* Day Header with Stats */}
      <Card className="bg-gradient-to-r from-white to-slate-50 border-slate-200/50 shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChefHat className="w-6 h-6 text-fitness-primary" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {getDayName(selectedDayNumber)} - {format(dayDate, 'MMM d')}
                </h2>
                <p className="text-gray-600">{mealPlanT('dailyOverview')}</p>
              </div>
            </div>
            <Button onClick={onAddSnack} variant="outline" size="sm">
              Add Snack
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-sm font-medium text-red-700 mb-1">Calories</div>
              <div className="text-2xl font-bold text-red-800">{totalCalories}</div>
              <div className="text-xs text-red-600">of {targetDayCalories}</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-700 mb-1">Protein</div>
              <div className="text-2xl font-bold text-blue-800">{totalProtein.toFixed(1)}g</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-700 mb-1">Meals</div>
              <div className="text-2xl font-bold text-green-800">{dailyMeals.length}</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-700 mb-1">Progress</div>
              <div className="text-2xl font-bold text-purple-800">
                {Math.round((totalCalories / targetDayCalories) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals List */}
      {dailyMeals.length > 0 ? (
        <div className="space-y-4">
          {dailyMeals.map((meal, index) => (
            <Card key={meal.id} className="border-l-4 border-l-fitness-primary shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="capitalize">
                        {meal.meal_type}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {meal.prep_time + meal.cook_time} min
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-lg mb-3 text-gray-800">{meal.name}</h4>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                      <div className="text-center bg-red-50 rounded p-2 border border-red-100">
                        <span className="text-gray-600 block">Calories</span>
                        <p className="font-bold text-red-600">{meal.calories}</p>
                      </div>
                      <div className="text-center bg-blue-50 rounded p-2 border border-blue-100">
                        <span className="text-gray-600 block">Protein</span>
                        <p className="font-bold text-blue-600">{meal.protein}g</p>
                      </div>
                      <div className="text-center bg-green-50 rounded p-2 border border-green-100">
                        <span className="text-gray-600 block">Carbs</span>
                        <p className="font-bold text-green-600">{meal.carbs}g</p>
                      </div>
                      <div className="text-center bg-orange-50 rounded p-2 border border-orange-100">
                        <span className="text-gray-600 block">Fat</span>
                        <p className="font-bold text-orange-600">{meal.fat}g</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewMeal(meal)}
                    className="flex items-center gap-2"
                  >
                    <Book className="w-4 h-4" />
                    View Recipe
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onExchangeMeal(meal, index)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Exchange Meal
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center border-dashed border-2 border-gray-300">
          <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No meals planned for this day</p>
          <Button onClick={onAddSnack} variant="outline">
            Add Your First Meal
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DayOverview;
