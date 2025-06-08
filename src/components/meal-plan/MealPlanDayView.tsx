
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Clock, Users, ChefHat, ArrowLeftRight } from "lucide-react";
import type { DailyMeal } from "@/features/meal-plan/types";

interface MealPlanDayViewProps {
  dayNumber: number;
  weeklyPlan: any;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index: number) => void;
  onAddSnack: () => void;
}

const MealPlanDayView = ({ 
  dayNumber, 
  weeklyPlan, 
  onShowRecipe, 
  onExchangeMeal, 
  onAddSnack 
}: MealPlanDayViewProps) => {
  const dayMeals = weeklyPlan?.dailyMeals?.filter(
    (meal: DailyMeal) => meal.day_number === dayNumber
  ) || [];

  const dayCalories = dayMeals.reduce((sum: number, meal: DailyMeal) => sum + (meal.calories || 0), 0);
  const dayProtein = dayMeals.reduce((sum: number, meal: DailyMeal) => sum + (meal.protein || 0), 0);
  const targetCalories = 2000;

  return (
    <div className="space-y-4">
      {/* Day Stats */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Daily Calories</p>
              <p className="text-2xl font-bold text-gray-900">{dayCalories}</p>
              <Progress value={(dayCalories / targetCalories) * 100} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">{Math.round((dayCalories / targetCalories) * 100)}% of target</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Protein</p>
              <p className="text-2xl font-bold text-gray-900">{dayProtein.toFixed(1)}g</p>
              <Progress value={(dayProtein / 150) * 100} className="mt-2" />
              <p className="text-xs text-gray-500 mt-1">{Math.round((dayProtein / 150) * 100)}% of target</p>
            </div>
          </div>
          <Button 
            onClick={onAddSnack}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Snack
          </Button>
        </CardContent>
      </Card>

      {/* Meals */}
      <div className="space-y-3">
        {dayMeals.map((meal: DailyMeal, index: number) => {
          const prepTime = meal.prep_time || 0;
          const cookTime = meal.cook_time || 0;
          const servings = meal.servings || 1;
          const totalTime = prepTime + cookTime;

          return (
            <Card key={meal.id} className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200 group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {meal.meal_type}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {totalTime} min
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {servings} serving{servings !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {meal.name}
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <span className="font-medium text-blue-600">{meal.calories || 0}</span>
                        <div className="text-gray-500">cal</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <span className="font-medium text-green-600">{(meal.protein || 0).toFixed(1)}g</span>
                        <div className="text-gray-500">protein</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <span className="font-medium text-orange-600">{(meal.carbs || 0).toFixed(1)}g</span>
                        <div className="text-gray-500">carbs</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <span className="font-medium text-purple-600">{(meal.fat || 0).toFixed(1)}g</span>
                        <div className="text-gray-500">fat</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => onShowRecipe(meal)}
                  >
                    <ChefHat className="w-3 h-3 mr-1" />
                    Recipe
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 hover:bg-orange-50 hover:border-orange-300"
                    onClick={() => onExchangeMeal(meal, index)}
                  >
                    <ArrowLeftRight className="w-3 h-3 mr-1" />
                    Exchange
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MealPlanDayView;
