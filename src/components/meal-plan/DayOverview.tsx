
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Book, ArrowLeftRight, Sparkles, Plus } from "lucide-react";
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

  // Daily nutrition summary
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Daily Summary Card */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 rounded-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-fitness-primary-800">
                {getDayName(selectedDayNumber)}
              </h2>
              <p className="text-fitness-primary-600">
                {format(dayDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <Button
              onClick={onAddSnack}
              className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Snack
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-2xl font-bold text-fitness-primary-700">{totalCalories}</div>
              <div className="text-sm text-fitness-primary-600">Calories</div>
              <div className="text-xs text-gray-500 mt-1">{remainingCalories} remaining</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-2xl font-bold text-blue-700">{totalProtein.toFixed(0)}g</div>
              <div className="text-sm text-blue-600">Protein</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-2xl font-bold text-green-700">{dailyMeals.length}</div>
              <div className="text-sm text-green-600">Meals</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-fitness-primary-200">
              <div className="text-2xl font-bold text-orange-700">{calorieProgress.toFixed(0)}%</div>
              <div className="text-sm text-orange-600">Target Met</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Meals List */}
      {dailyMeals.length > 0 ? (
        <div className="space-y-4">
          {dailyMeals.map((meal, index) => (
            <Card key={meal.id} className="bg-white border-fitness-primary-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-fitness-primary-500 text-white capitalize px-3 py-1 rounded-full">
                        {meal.meal_type}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {(meal.prep_time || 0) + (meal.cook_time || 0)} min
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {meal.servings} serving{meal.servings !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <h4 className="font-bold text-xl mb-4 text-fitness-primary-700">
                      {meal.name}
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-3 text-sm mb-4">
                      <div className="text-center bg-red-50 rounded-lg p-3 border border-red-100">
                        <span className="text-gray-600 block text-xs mb-1">Calories</span>
                        <p className="font-bold text-red-600 text-lg">{meal.calories}</p>
                      </div>
                      <div className="text-center bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <span className="text-gray-600 block text-xs mb-1">Protein</span>
                        <p className="font-bold text-blue-600 text-lg">{meal.protein}g</p>
                      </div>
                      <div className="text-center bg-green-50 rounded-lg p-3 border border-green-100">
                        <span className="text-gray-600 block text-xs mb-1">Carbs</span>
                        <p className="font-bold text-green-600 text-lg">{meal.carbs}g</p>
                      </div>
                      <div className="text-center bg-orange-50 rounded-lg p-3 border border-orange-100">
                        <span className="text-gray-600 block text-xs mb-1">Fat</span>
                        <p className="font-bold text-orange-600 text-lg">{meal.fat}g</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button 
                    size="sm" 
                    onClick={() => onViewMeal(meal)}
                    className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    View Recipe
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onExchangeMeal(meal, index)}
                    className="border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50"
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
        <Card className="p-12 text-center border-dashed border-2 border-fitness-primary-200 bg-fitness-primary-25 rounded-xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-fitness-primary-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-10 w-10 text-fitness-primary-500" />
          </div>
          <h3 className="text-xl font-bold text-fitness-primary-700 mb-3">No meals planned for this day</h3>
          <p className="text-fitness-primary-600 mb-6">Start building your perfect day with AI-powered meal suggestions</p>
          <Button 
            onClick={onAddSnack} 
            className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white px-8 py-3"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Add Your First Meal
          </Button>
        </Card>
      )}
    </div>
  );
};

export default DayOverview;
