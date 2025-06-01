
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Book, ArrowLeftRight, Plus, Utensils, Flame } from "lucide-react";
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
    const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  const dayDate = getDateForDay(selectedDayNumber);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);

  const mealTypeColors = {
    breakfast: 'bg-orange-50 border-orange-200 text-orange-700',
    lunch: 'bg-green-50 border-green-200 text-green-700',
    dinner: 'bg-blue-50 border-blue-200 text-blue-700',
    snack1: 'bg-purple-50 border-purple-200 text-purple-700',
    snack2: 'bg-pink-50 border-pink-200 text-pink-700'
  };

  return (
    <div className="space-y-4">
      {/* Daily Summary Card */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 rounded-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold text-fitness-primary-800">
                {getDayName(selectedDayNumber)}
              </h2>
              <p className="text-sm text-fitness-primary-600">
                {format(dayDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <div className="text-lg font-bold text-fitness-primary-700 flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {totalCalories} cal
                </div>
                <div className="text-xs text-fitness-primary-600">{remainingCalories} remaining</div>
              </div>
              <Button
                onClick={onAddSnack}
                size="sm"
                className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Snack
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-lg font-bold text-fitness-primary-700">{dailyMeals.length}</div>
              <div className="text-xs text-fitness-primary-600">Meals</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-lg font-bold text-blue-700">{totalProtein.toFixed(0)}g</div>
              <div className="text-xs text-blue-600">Protein</div>
            </div>
            <div className="text-center p-2 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-lg font-bold text-green-700">{calorieProgress.toFixed(0)}%</div>
              <div className="text-xs text-green-600">Target</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-fitness-primary-600 mb-1">
              <span>Calorie Progress</span>
              <span>{calorieProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-fitness-primary-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals List - Smaller Cards */}
      {dailyMeals.length > 0 ? (
        <div className="space-y-2">
          {dailyMeals.map((meal, index) => (
            <Card key={meal.id} className="bg-white border-fitness-primary-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden">
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 bg-fitness-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-3 h-3 text-fitness-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Badge className={`capitalize px-2 py-0.5 text-xs font-medium mb-1 ${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        {meal.meal_type}
                      </Badge>
                      <h4 className="font-semibold text-sm text-fitness-primary-800 truncate">
                        {meal.name}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-fitness-primary-700">{meal.calories}</div>
                    <div className="text-xs text-fitness-primary-600">cal</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                  <div className="text-center bg-blue-50 rounded-md p-1 border border-blue-100">
                    <span className="text-gray-600 block text-xs">Protein</span>
                    <p className="font-bold text-blue-600 text-xs">{meal.protein}g</p>
                  </div>
                  <div className="text-center bg-green-50 rounded-md p-1 border border-green-100">
                    <span className="text-gray-600 block text-xs">Carbs</span>
                    <p className="font-bold text-green-600 text-xs">{meal.carbs}g</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-md p-1 border border-orange-100">
                    <span className="text-gray-600 block text-xs">Fat</span>
                    <p className="font-bold text-orange-600 text-xs">{meal.fat}g</p>
                  </div>
                </div>
                
                <div className="flex gap-1.5">
                  <Button 
                    size="sm" 
                    onClick={() => onViewMeal(meal)}
                    className="flex-1 bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white h-6 text-xs px-2"
                  >
                    <Book className="w-3 h-3 mr-1" />
                    Recipe
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onExchangeMeal(meal, index)}
                    className="flex-1 border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50 h-6 text-xs px-2"
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
        <Card className="p-6 text-center border-dashed border-2 border-fitness-primary-200 bg-fitness-primary-25 rounded-xl">
          <div className="w-12 h-12 mx-auto mb-3 bg-fitness-primary-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-6 w-6 text-fitness-primary-500" />
          </div>
          <h3 className="text-lg font-bold text-fitness-primary-700 mb-2">No meals planned for this day</h3>
          <p className="text-fitness-primary-600 mb-4 text-sm">Start building your perfect day with AI-powered meal suggestions</p>
          <Button 
            onClick={onAddSnack} 
            className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Meal
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DayOverview;
