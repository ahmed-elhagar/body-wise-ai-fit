
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Award } from "lucide-react";

interface DailyNutritionSummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

const DailyNutritionSummary = ({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat
}: DailyNutritionSummaryProps) => {
  const calorieProgress = Math.min(100, (totalCalories / targetCalories) * 100);
  const proteinProgress = Math.min(100, (totalProtein / targetProtein) * 100);
  const carbsProgress = Math.min(100, (totalCarbs / targetCarbs) * 100);
  const fatProgress = Math.min(100, (totalFat / targetFat) * 100);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Target className="w-5 h-5" />
          Daily Nutrition Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
            <div className="text-sm text-gray-600 mb-2">Calories</div>
            <Progress value={calorieProgress} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              {targetCalories - totalCalories > 0 ? `${targetCalories - totalCalories} left` : 'Target reached'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
            <div className="text-sm text-gray-600 mb-2">Protein</div>
            <Progress value={proteinProgress} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              Target: {targetProtein}g
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCarbs}g</div>
            <div className="text-sm text-gray-600 mb-2">Carbs</div>
            <Progress value={carbsProgress} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              Target: {targetCarbs}g
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{totalFat}g</div>
            <div className="text-sm text-gray-600 mb-2">Fat</div>
            <Progress value={fatProgress} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              Target: {targetFat}g
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              {calorieProgress >= 80 ? 'On Track' : 'Need More Calories'}
            </span>
          </div>
          {calorieProgress >= 100 && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-gold-500" />
              <span className="text-green-600 font-medium">Goal Achieved!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyNutritionSummary;
