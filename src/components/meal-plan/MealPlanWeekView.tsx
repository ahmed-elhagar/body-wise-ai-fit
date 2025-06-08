
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChefHat, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import type { DailyMeal } from "@/hooks/useMealPlanData";

interface MealPlanWeekViewProps {
  weeklyPlan: any;
  weekDays: Array<{ number: number; name: string; date: Date }>;
  weekOffset: number;
  onShowRecipe: (meal: DailyMeal) => void;
  onExchangeMeal: (meal: DailyMeal, index: number) => void;
  onAddSnack: (dayNumber: number) => void;
}

const MealPlanWeekView = ({ 
  weeklyPlan, 
  weekDays, 
  weekOffset,
  onShowRecipe, 
  onExchangeMeal, 
  onAddSnack 
}: MealPlanWeekViewProps) => {
  console.log('🗓️ MealPlanWeekView - Rendering with:', {
    weekOffset,
    weeklyPlanId: weeklyPlan?.weeklyPlan?.id,
    weekStartDate: weeklyPlan?.weeklyPlan?.week_start_date,
    dailyMealsCount: weeklyPlan?.dailyMeals?.length || 0
  });

  const getDayMeals = (dayNumber: number) => {
    const meals = weeklyPlan?.dailyMeals?.filter(
      (meal: DailyMeal) => meal.day_number === dayNumber
    ) || [];
    
    console.log(`🍽️ Day ${dayNumber} meals:`, meals.length);
    return meals;
  };

  const getDayCalories = (dayNumber: number) => {
    const meals = getDayMeals(dayNumber);
    return meals.reduce((sum: number, meal: DailyMeal) => sum + (meal.calories || 0), 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {weekDays.map((day) => {
        const dayMeals = getDayMeals(day.number);
        const dayCalories = getDayCalories(day.number);
        
        return (
          <Card key={`${weekOffset}-${day.number}`} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {day.name}
                </CardTitle>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {dayCalories} cal
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {format(day.date, 'MMM d')}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {dayMeals.map((meal: DailyMeal, index: number) => (
                <div key={`${meal.id}-${weekOffset}`} className="p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <Badge 
                        variant="outline" 
                        className="mb-1 bg-white text-gray-700 border border-gray-300"
                      >
                        {meal.meal_type}
                      </Badge>
                      <h5 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {meal.name}
                      </h5>
                    </div>
                    <span className="text-xs font-medium text-blue-600">
                      {meal.calories || 0} cal
                    </span>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs hover:bg-blue-50"
                      onClick={() => onShowRecipe(meal)}
                    >
                      <ChefHat className="w-3 h-3 mr-1" />
                      Recipe
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-7 text-xs hover:bg-orange-50"
                      onClick={() => onExchangeMeal(meal, index)}
                    >
                      <ArrowLeftRight className="w-3 h-3 mr-1" />
                      Exchange
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                size="sm"
                variant="outline"
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => onAddSnack(day.number)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Snack
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MealPlanWeekView;
