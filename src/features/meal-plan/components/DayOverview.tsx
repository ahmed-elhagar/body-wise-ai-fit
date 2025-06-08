
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChefHat, ArrowLeftRight, Plus, Calendar, Target, TrendingUp, Award } from "lucide-react";
import { format } from "date-fns";
import type { DailyMeal } from "@/features/meal-plan/types";

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
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4); // 30% of calories from protein
  const proteinProgress = Math.min(100, (totalProtein / proteinTarget) * 100);

  return (
    <div className="space-y-6">
      {/* Enhanced Day Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-fitness-primary-600" />
              <div>
                <h2 className="text-2xl font-bold text-fitness-primary-800">
                  {getDayName(selectedDayNumber)}
                </h2>
                <p className="text-sm text-fitness-primary-600">
                  {format(getDateForDay(selectedDayNumber), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onAddSnack}
                className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Snack
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Enhanced Nutrition Progress */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
              <div className="text-sm text-gray-600 mb-2">Calories</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {remainingCalories} remaining of {targetDayCalories}
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
              <div className="text-sm text-gray-600 mb-2">Protein</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${proteinProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Target: {proteinTarget}g
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{dailyMeals.length}</div>
              <div className="text-sm text-gray-600">Meals Planned</div>
              <div className="flex items-center justify-center mt-2">
                <Award className="w-4 h-4 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">
                  {dailyMeals.length >= 3 ? 'Complete' : 'In Progress'}
                </span>
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-600">Daily Goal</div>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                <span className="text-xs text-purple-600">
                  {progressPercentage >= 80 ? 'On Track' : 'Need More'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Meals List */}
      <div className="space-y-4">
        {dailyMeals.length > 0 ? (
          dailyMeals.map((meal) => (
            <Card key={meal.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-fitness-primary-500">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge 
                        className={`${mealTypeColors[meal.meal_type as keyof typeof mealTypeColors] || 'bg-gray-100 border-gray-300 text-gray-700'} font-medium`}
                      >
                        {meal.meal_type}
                      </Badge>
                      <h3 className="font-semibold text-lg text-gray-800">{meal.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">{meal.calories} cal</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">{meal.protein}g protein</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">{meal.carbs}g carbs</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">{meal.fat}g fat</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => onViewMeal(meal)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm"
                    >
                      <ChefHat className="w-4 h-4 mr-1" />
                      Recipe
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onExchangeMeal(meal)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
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
          <Card className="border-dashed border-2 border-fitness-primary-300 bg-gradient-to-br from-fitness-primary-50 to-white">
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-fitness-primary-400" />
              <h3 className="text-xl font-semibold mb-2 text-fitness-primary-800">No meals planned for this day</h3>
              <p className="text-fitness-primary-600 mb-6 max-w-md mx-auto">
                Start your day right by adding nutritious meals and snacks to reach your daily goals.
              </p>
              <Button 
                onClick={onAddSnack} 
                className="bg-fitness-primary-500 hover:bg-fitness-primary-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
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
