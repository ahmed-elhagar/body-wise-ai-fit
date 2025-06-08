
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Target } from "lucide-react";
import DailyNutritionSummary from "./daily-view/DailyNutritionSummary";
import MealTypeSection from "./daily-view/MealTypeSection";
import { format } from "date-fns";

interface CompactDailyViewProps {
  selectedDate: Date;
  meals: any[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  onMealClick: (meal: any) => void;
  onAddSnack: () => void;
}

const CompactDailyView = ({
  selectedDate,
  meals,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  targetCalories = 2000,
  targetProtein = 150,
  targetCarbs = 250,
  targetFat = 67,
  onMealClick,
  onAddSnack
}: CompactDailyViewProps) => {
  const mealsByType = meals.reduce((acc, meal) => {
    const type = meal.meal_type || 'snack';
    if (!acc[type]) acc[type] = [];
    acc[type].push(meal);
    return acc;
  }, {} as Record<string, any[]>);

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'snack1', 'snack2'];

  return (
    <div className="space-y-6">
      {/* Date Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calendar className="w-5 h-5" />
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{meals.length}</div>
                <div className="text-sm text-gray-600">Meals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
            </div>
            <Button onClick={onAddSnack} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Snack
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Summary */}
      <DailyNutritionSummary
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        totalCarbs={totalCarbs}
        totalFat={totalFat}
        targetCalories={targetCalories}
        targetProtein={targetProtein}
        targetCarbs={targetCarbs}
        targetFat={targetFat}
      />

      {/* Meal Type Sections */}
      <div className="space-y-4">
        {mealTypes.map(mealType => (
          <MealTypeSection
            key={mealType}
            mealType={mealType}
            meals={mealsByType[mealType] || []}
            onMealClick={onMealClick}
          />
        ))}
      </div>

      {meals.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No meals logged today</h3>
            <p className="text-gray-500 text-center mb-6">Start tracking your nutrition by adding your first meal or snack.</p>
            <Button onClick={onAddSnack} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Meal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CompactDailyView;
