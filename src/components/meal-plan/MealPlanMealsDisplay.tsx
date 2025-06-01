
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Utensils, ChefHat, Sparkles } from "lucide-react";
import { format } from "date-fns";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealPlanMealsDisplayProps {
  selectedDate: Date;
  todaysMeals: DailyMeal[] | undefined;
  currentWeekPlan: any;
  handleShowRecipe: (meal: DailyMeal) => void;
  handleExchangeMeal: (meal: DailyMeal, index: number) => void;
  setShowAIDialog: (show: boolean) => void;
}

const MealPlanMealsDisplay = ({
  selectedDate,
  todaysMeals,
  currentWeekPlan,
  handleShowRecipe,
  handleExchangeMeal,
  setShowAIDialog
}: MealPlanMealsDisplayProps) => {
  if (!currentWeekPlan) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <ChefHat className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Meal Plan Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first AI-powered meal plan tailored to your preferences and goals.
            </p>
            <Button
              onClick={() => setShowAIDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Your First Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Utensils className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {format(selectedDate, 'EEEE')} Meals
            </h2>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
            {todaysMeals?.length || 0} meals planned
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {todaysMeals?.length > 0 ? (
          <div className="grid gap-3">
            {todaysMeals.map((meal, index) => (
              <Card key={`${meal.id}-${index}`} className="bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                        <h4 className="font-bold text-lg text-gray-800">{meal.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {meal.meal_type}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                          <div className="text-sm font-bold text-red-600">{meal.calories}</div>
                          <div className="text-xs text-red-500">calories</div>
                        </div>
                        <div className="text-center p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <div className="text-sm font-bold text-green-600">{meal.protein}g</div>
                          <div className="text-xs text-green-500">protein</div>
                        </div>
                        <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <div className="text-sm font-bold text-blue-600">{meal.prep_time || 15}m</div>
                          <div className="text-xs text-blue-500">prep time</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => handleShowRecipe(meal)}
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      >
                        <ChefHat className="w-4 h-4 mr-2" />
                        Recipe
                      </Button>
                      <Button
                        onClick={() => handleExchangeMeal(meal, index)}
                        size="sm"
                        variant="outline"
                        className="bg-white hover:bg-gray-50"
                      >
                        Exchange
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600">No meals planned for this day</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanMealsDisplay;
