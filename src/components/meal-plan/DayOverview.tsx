
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
    <div className="space-y-3">
      {/* Daily Summary Card - More Compact */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 rounded-lg">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-left">
              <h2 className="text-lg font-bold text-fitness-primary-800">
                {getDayName(selectedDayNumber)}
              </h2>
              <p className="text-xs text-fitness-primary-600">
                {format(dayDate, 'MMM d, yyyy')}
              </p>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <div className="text-base font-bold text-fitness-primary-700 flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  {totalCalories} cal
                </div>
                <div className="text-xs text-fitness-primary-600">{remainingCalories} remaining</div>
              </div>
              <Button
                onClick={onAddSnack}
                size="sm"
                className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white px-2 py-1 text-xs h-7"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Snack
              </Button>
            </div>
          </div>

          {/* Compact Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="text-center p-1.5 bg-white rounded border border-fitness-primary-200">
              <div className="text-sm font-bold text-fitness-primary-700">{dailyMeals.length}</div>
              <div className="text-xs text-fitness-primary-600">Meals</div>
            </div>
            <div className="text-center p-1.5 bg-white rounded border border-fitness-primary-200">
              <div className="text-sm font-bold text-blue-700">{totalProtein.toFixed(0)}g</div>
              <div className="text-xs text-blue-600">Protein</div>
            </div>
            <div className="text-center p-1.5 bg-white rounded border border-fitness-primary-200">
              <div className="text-sm font-bold text-green-700">{calorieProgress.toFixed(0)}%</div>
              <div className="text-xs text-green-600">Target</div>
            </div>
          </div>

          {/* Compact Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-fitness-primary-600 mb-1">
              <span>Progress</span>
              <span>{calorieProgress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-fitness-primary-100 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-fitness-primary-500 to-fitness-accent-500 h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals List - Revamped Design */}
      {dailyMeals.length > 0 ? (
        <div className="space-y-3">
          {dailyMeals.map((meal, index) => (
            <Card key={meal.id} className="bg-white border-fitness-primary-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group">
              <div className="p-4">
                {/* Meal Header with Left Alignment */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-6 h-6 bg-fitness-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <Utensils className="w-3 h-3 text-fitness-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`capitalize px-2 py-1 text-xs font-medium ${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                          {meal.meal_type}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-fitness-primary-800 leading-tight text-left">
                        {meal.name}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <div className="text-lg font-bold text-fitness-primary-700">{meal.calories}</div>
                    <div className="text-xs text-fitness-primary-600">cal</div>
                  </div>
                </div>
                
                {/* Revamped Nutrition Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                    <div className="text-lg font-bold text-blue-700">{meal.protein}g</div>
                    <div className="text-xs text-blue-600 font-medium">Protein</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                    <div className="text-lg font-bold text-green-700">{meal.carbs}g</div>
                    <div className="text-xs text-green-600 font-medium">Carbs</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                    <div className="text-lg font-bold text-orange-700">{meal.fat}g</div>
                    <div className="text-xs text-orange-600 font-medium">Fat</div>
                  </div>
                </div>
                
                {/* Revamped Action Buttons - New Position and Style */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button 
                    size="sm" 
                    onClick={() => onViewMeal(meal)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium h-9 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    View Recipe
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onExchangeMeal(meal, index)}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium h-9 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Exchange
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4 text-center border-dashed border-2 border-fitness-primary-200 bg-fitness-primary-25 rounded-lg">
          <div className="w-10 h-10 mx-auto mb-2 bg-fitness-primary-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-fitness-primary-500" />
          </div>
          <h3 className="text-base font-bold text-fitness-primary-700 mb-1">No meals planned for this day</h3>
          <p className="text-fitness-primary-600 mb-3 text-sm">Start building your perfect day with AI-powered meal suggestions</p>
          <Button 
            onClick={onAddSnack} 
            className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white px-3 py-2 text-sm"
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
