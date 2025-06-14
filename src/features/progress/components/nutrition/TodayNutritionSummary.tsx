
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Utensils } from "lucide-react";

interface TodayNutritionSummaryProps {
  totalCalories: number;
  targetDayCalories: number;
  totalProtein: number;
  proteinTarget: number;
  mealsPlanned: number;
}

export const TodayNutritionSummary = ({
  totalCalories,
  targetDayCalories,
  totalProtein,
  proteinTarget,
  mealsPlanned
}: TodayNutritionSummaryProps) => {
  const calorieProgress = targetDayCalories > 0 ? Math.min(100, (totalCalories / targetDayCalories) * 100) : 0;
  const proteinProgress = proteinTarget > 0 ? Math.min(100, (totalProtein / proteinTarget) * 100) : 0;
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Utensils className="w-5 h-5" />
          Today's Nutrition Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-900 mb-1">{totalCalories}</div>
            <div className="text-sm text-green-600 mb-2">Calories Consumed</div>
            <Progress value={calorieProgress} className="h-2" />
            <div className="text-xs text-green-500 mt-1">
              {remainingCalories} remaining
            </div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-900 mb-1">{totalProtein}g</div>
            <div className="text-sm text-green-600 mb-2">Protein Intake</div>
            <Progress value={proteinProgress} className="h-2" />
            <div className="text-xs text-green-500 mt-1">
              Target: {proteinTarget}g
            </div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-900 mb-1">{mealsPlanned}</div>
            <div className="text-sm text-green-600 mb-2">Meals Planned</div>
            <Progress value={(mealsPlanned / 3) * 100} className="h-2" />
            <div className="text-xs text-green-500 mt-1">
              {3 - mealsPlanned} more to go
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
