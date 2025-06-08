import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat } from "lucide-react";
import type { DailyMeal } from "@/hooks/useMealPlanData";
import { format, addDays } from "date-fns";

interface MealPlanDayContentProps {
  selectedDay: number;
  todaysMeals: DailyMeal[];
  onMealClick: (meal: DailyMeal) => void;
  onRecipeClick: (meal: DailyMeal) => void;
  onExchangeClick: (meal: DailyMeal, index: number) => void;
  weekStartDate: Date;
}

const MealPlanDayContent = ({
  selectedDay,
  todaysMeals,
  onMealClick,
  onRecipeClick,
  onExchangeClick,
  weekStartDate
}: MealPlanDayContentProps) => {
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Day';
  };

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  const dayDate = getDateForDay(selectedDay);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-fitness-primary" />
          {getDayName(selectedDay)} - {format(dayDate, 'MMM d')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todaysMeals.length > 0 ? (
          <div className="space-y-4">
            {todaysMeals.map((meal, index) => (
              <Card key={meal.id} className="border-l-4 border-l-fitness-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
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
                      
                      <h4 className="font-semibold text-lg mb-2">{meal.name}</h4>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Calories</span>
                          <p className="font-medium">{meal.calories}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Protein</span>
                          <p className="font-medium">{meal.protein}g</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Carbs</span>
                          <p className="font-medium">{meal.carbs}g</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Fat</span>
                          <p className="font-medium">{meal.fat}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onRecipeClick(meal)}
                    >
                      View Recipe
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onExchangeClick(meal, index)}
                    >
                      Exchange Meal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No meals planned for this day</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanDayContent;
