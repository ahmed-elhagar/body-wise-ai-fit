
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, Clock, Flame, ShoppingCart } from "lucide-react";
import type { DailyMeal, MealPlanFetchResult } from "@/types/mealPlan";
import { getDayName } from "@/utils/mealPlanUtils";

interface MealPlanContentProps {
  mealPlanData: MealPlanFetchResult | null;
  dailyMeals: DailyMeal[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  selectedDayNumber: number;
  weekStartDate: Date;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index: number) => void;
  onShowAddSnack: () => void;
  onShowShoppingList: () => void;
  onShowAIDialog: () => void;
}

const MealPlanContent = ({
  mealPlanData,
  dailyMeals,
  totalCalories,
  totalProtein,
  targetDayCalories,
  selectedDayNumber,
  onShowRecipe,
  onExchangeMeal,
  onShowAddSnack,
  onShowShoppingList,
  onShowAIDialog
}: MealPlanContentProps) => {
  if (!mealPlanData) {
    return (
      <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="w-16 h-16 bg-fitness-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-8 h-8 text-fitness-primary-500" />
        </div>
        <h3 className="text-xl font-semibold text-fitness-primary-700 mb-2">
          No Meal Plan Available
        </h3>
        <p className="text-fitness-primary-600 mb-6">
          Generate your personalized AI meal plan to get started
        </p>
        <Button
          onClick={onShowAIDialog}
          className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white"
        >
          Generate AI Meal Plan
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Stats */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {getDayName(selectedDayNumber)} Overview
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={onShowAddSnack}
              variant="outline"
              size="sm"
            >
              Add Snack
            </Button>
            <Button
              onClick={onShowShoppingList}
              variant="outline"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shopping List
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Calories</span>
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {totalCalories} / {targetDayCalories}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Protein</div>
            <div className="text-lg font-semibold text-gray-800">
              {Math.round(totalProtein)}g
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Meals</div>
            <div className="text-lg font-semibold text-gray-800">
              {dailyMeals.length}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className="text-lg font-semibold text-gray-800">
              {Math.round((totalCalories / targetDayCalories) * 100)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Meals List */}
      <div className="space-y-4">
        {dailyMeals.length > 0 ? (
          dailyMeals.map((meal, index) => (
            <Card key={meal.id} className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-fitness-primary-100 text-fitness-primary-700">
                      {meal.meal_type}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {meal.prep_time + meal.cook_time} min
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {meal.name}
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Calories:</span>
                      <span className="font-medium ml-1">{meal.calories}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Protein:</span>
                      <span className="font-medium ml-1">{Math.round(meal.protein)}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Carbs:</span>
                      <span className="font-medium ml-1">{Math.round(meal.carbs)}g</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fat:</span>
                      <span className="font-medium ml-1">{Math.round(meal.fat)}g</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onClick={() => onShowRecipe(meal)}
                    variant="outline"
                    size="sm"
                  >
                    Recipe
                  </Button>
                  <Button
                    onClick={() => onExchangeMeal(meal, index)}
                    variant="outline"
                    size="sm"
                  >
                    Exchange
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="w-16 h-16 bg-fitness-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-fitness-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-fitness-primary-700 mb-2">
              No meals for {getDayName(selectedDayNumber)}
            </h3>
            <p className="text-fitness-primary-600">
              Add a snack or generate a new meal plan
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MealPlanContent;
