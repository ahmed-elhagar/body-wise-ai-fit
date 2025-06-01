
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Book, ArrowLeftRight, Sparkles, Plus, Utensils } from "lucide-react";
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-fitness-primary-800">
                {getDayName(selectedDayNumber)}
              </h2>
              <p className="text-sm text-fitness-primary-600">
                {format(dayDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-fitness-primary-700">{totalCalories} cal</div>
              <div className="text-xs text-fitness-primary-600">{remainingCalories} remaining</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-lg font-bold text-fitness-primary-700">{dailyMeals.length}</div>
              <div className="text-xs text-fitness-primary-600">Meals</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-lg font-bold text-blue-700">{totalProtein.toFixed(0)}g</div>
              <div className="text-xs text-blue-600">Protein</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-lg font-bold text-green-700">{calorieProgress.toFixed(0)}%</div>
              <div className="text-xs text-green-600">Target</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-fitness-primary-200">
              <Button
                onClick={onAddSnack}
                size="sm"
                className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white w-full h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Snack
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals List */}
      {dailyMeals.length > 0 ? (
        <div className="space-y-3">
          {dailyMeals.map((meal, index) => (
            <Card key={meal.id} className="bg-white border-fitness-primary-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-fitness-primary-100 rounded-lg flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-fitness-primary-600" />
                    </div>
                    <div>
                      <Badge className={`capitalize px-2 py-1 text-xs font-medium ${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                        {meal.meal_type}
                      </Badge>
                      <h4 className="font-bold text-lg text-fitness-primary-800 mt-1">
                        {meal.name}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-fitness-primary-700">{meal.calories}</div>
                    <div className="text-xs text-fitness-primary-600">calories</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                  <div className="text-center bg-blue-50 rounded-lg p-2 border border-blue-100">
                    <span className="text-gray-600 block mb-1">Protein</span>
                    <p className="font-bold text-blue-600">{meal.protein}g</p>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg p-2 border border-green-100">
                    <span className="text-gray-600 block mb-1">Carbs</span>
                    <p className="font-bold text-green-600">{meal.carbs}g</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-2 border border-orange-100">
                    <span className="text-gray-600 block mb-1">Fat</span>
                    <p className="font-bold text-orange-600">{meal.fat}g</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button 
                    size="sm" 
                    onClick={() => onViewMeal(meal)}
                    className="flex-1 bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white h-8 text-xs"
                  >
                    <Book className="w-3 h-3 mr-1" />
                    View Recipe
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onExchangeMeal(meal, index)}
                    className="flex-1 border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50 h-8 text-xs"
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
        <Card className="p-8 text-center border-dashed border-2 border-fitness-primary-200 bg-fitness-primary-25 rounded-xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-fitness-primary-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-fitness-primary-500" />
          </div>
          <h3 className="text-lg font-bold text-fitness-primary-700 mb-2">No meals planned for this day</h3>
          <p className="text-fitness-primary-600 mb-4">Start building your perfect day with AI-powered meal suggestions</p>
          <Button 
            onClick={onAddSnack} 
            className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white px-6 py-2"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Add Your First Meal
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DayOverview;
