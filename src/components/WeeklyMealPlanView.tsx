
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChefHat, Utensils } from "lucide-react";
import type { Meal } from "@/types/meal";

interface WeeklyMealPlanViewProps {
  weeklyPlan: any;
  onShowRecipe: (meal: Meal) => void;
  onExchangeMeal: (meal: Meal, dayNumber: number, mealIndex: number) => void;
}

const WeeklyMealPlanView = ({ weeklyPlan, onShowRecipe, onExchangeMeal }: WeeklyMealPlanViewProps) => {
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const getDietType = () => {
    // Analyze meals to determine diet type
    if (!weeklyPlan?.dailyMeals?.length) return 'Balanced';
    
    const allIngredients = weeklyPlan.dailyMeals
      .flatMap((meal: any) => meal.ingredients || [])
      .map((ing: any) => (typeof ing === 'string' ? ing : ing.name || '').toLowerCase());
    
    const hasAnimalProducts = allIngredients.some((ing: string) => 
      ing.includes('meat') || ing.includes('chicken') || ing.includes('beef') || 
      ing.includes('pork') || ing.includes('fish') || ing.includes('salmon') ||
      ing.includes('tuna') || ing.includes('dairy') || ing.includes('cheese') ||
      ing.includes('milk') || ing.includes('egg')
    );
    
    const hasHighProtein = weeklyPlan.dailyMeals.some((meal: any) => (meal.protein || 0) > 25);
    const hasLowCarb = weeklyPlan.dailyMeals.some((meal: any) => (meal.carbs || 0) < 10);
    
    if (!hasAnimalProducts) return 'Vegetarian';
    if (hasLowCarb && hasHighProtein) return 'Keto';
    if (hasHighProtein) return 'High Protein';
    return 'Balanced';
  };

  const getDietTypeColor = (dietType: string) => {
    switch (dietType) {
      case 'Vegetarian': return 'bg-green-100 text-green-800 border-green-200';
      case 'Keto': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'High Protein': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMealsByDay = (dayNumber: number) => {
    return weeklyPlan?.dailyMeals?.filter((meal: any) => meal.day_number === dayNumber) || [];
  };

  const dietType = getDietType();

  return (
    <div className="space-y-6">
      {/* Diet Type Header */}
      <Card className="p-4 bg-gradient-to-r from-fitness-primary/10 to-pink-100 border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Utensils className="w-6 h-6 text-fitness-primary" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Weekly Meal Plan</h3>
              <p className="text-sm text-gray-600">Your personalized 7-day nutrition plan</p>
            </div>
          </div>
          <Badge className={`${getDietTypeColor(dietType)} font-semibold px-3 py-1`}>
            {dietType} Diet
          </Badge>
        </div>
      </Card>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dayNames.map((dayName, index) => {
          const dayNumber = index + 1;
          const dayMeals = getMealsByDay(dayNumber);
          const dayCalories = dayMeals.reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);
          
          return (
            <Card key={dayNumber} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">{dayName}</h4>
                <Badge variant="outline" className="bg-fitness-primary/10 text-fitness-primary">
                  {dayCalories} cal
                </Badge>
              </div>
              
              <div className="space-y-3">
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal: any, mealIndex: number) => (
                    <div key={mealIndex} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {meal.meal_type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {meal.prep_time || 0}min
                            </span>
                          </div>
                          <h5 className="font-medium text-gray-800 text-sm mb-1">{meal.name}</h5>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <span className="text-fitness-primary font-medium">{meal.calories || 0} cal</span>
                            <span className="text-green-600">{meal.protein || 0}g protein</span>
                            <span className="text-blue-600">{meal.carbs || 0}g carbs</span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => onShowRecipe({
                              ...meal,
                              type: meal.meal_type,
                              time: '08:00',
                              image: '🍽️',
                              cookTime: meal.cook_time || 0,
                              prepTime: meal.prep_time || 0
                            })}
                          >
                            <ChefHat className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => onExchangeMeal({
                              ...meal,
                              type: meal.meal_type,
                              time: '08:00',
                              image: '🍽️',
                              cookTime: meal.cook_time || 0,
                              prepTime: meal.prep_time || 0
                            }, dayNumber, mealIndex)}
                          >
                            ⇄
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No meals planned</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyMealPlanView;
