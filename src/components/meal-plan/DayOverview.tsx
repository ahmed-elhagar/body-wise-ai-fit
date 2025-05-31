
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Book, ArrowLeftRight, Sparkles } from "lucide-react";
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

  return (
    <div className="space-y-6">
      {/* Meals List */}
      {dailyMeals.length > 0 ? (
        <div className="space-y-4">
          {dailyMeals.map((meal, index) => (
            <Card key={meal.id} className="border-l-4 border-l-fitness-primary shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-fitness-primary-25">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white capitalize px-3 py-1">
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
                    
                    <h4 className="font-bold text-xl mb-4 text-fitness-primary-700 hover:text-fitness-primary-600 transition-colors">
                      {meal.name}
                    </h4>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm mb-6">
                      <div className="text-center bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                        <span className="text-gray-600 block text-xs mb-1">Calories</span>
                        <p className="font-bold text-red-600 text-lg">{meal.calories}</p>
                      </div>
                      <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                        <span className="text-gray-600 block text-xs mb-1">Protein</span>
                        <p className="font-bold text-blue-600 text-lg">{meal.protein}g</p>
                      </div>
                      <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                        <span className="text-gray-600 block text-xs mb-1">Carbs</span>
                        <p className="font-bold text-green-600 text-lg">{meal.carbs}g</p>
                      </div>
                      <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                        <span className="text-gray-600 block text-xs mb-1">Fat</span>
                        <p className="font-bold text-orange-600 text-lg">{meal.fat}g</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    size="sm" 
                    onClick={() => onViewMeal(meal)}
                    className="flex items-center gap-2 bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 hover:from-fitness-primary-600 hover:to-fitness-primary-700 text-white shadow-lg"
                  >
                    <Book className="w-4 h-4" />
                    View Recipe
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onExchangeMeal(meal, index)}
                    className="flex items-center gap-2 border-fitness-accent-300 text-fitness-accent-600 hover:bg-fitness-accent-50"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Exchange Meal
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed border-2 border-fitness-primary-300 bg-gradient-to-br from-fitness-primary-25 to-fitness-accent-25">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-fitness-primary-500 to-fitness-accent-500 rounded-full flex items-center justify-center">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-fitness-primary-700 mb-3">No meals planned for this day</h3>
          <p className="text-fitness-primary-600 mb-6">Start building your perfect day with AI-powered meal suggestions</p>
          <Button 
            onClick={onAddSnack} 
            className="bg-gradient-to-r from-fitness-accent-500 to-fitness-accent-600 hover:from-fitness-accent-600 hover:to-fitness-accent-700 text-white shadow-lg px-8 py-3"
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
