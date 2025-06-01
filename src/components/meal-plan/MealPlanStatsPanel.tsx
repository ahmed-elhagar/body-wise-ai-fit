
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Heart, Plus, BarChart3, Clock } from "lucide-react";

interface MealPlanStatsPanelProps {
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
}

const MealPlanStatsPanel = ({
  totalCalories,
  totalProtein,
  targetDayCalories
}: MealPlanStatsPanelProps) => {
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = 150;
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Daily Progress Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Daily Progress</h3>
              <p className="text-sm text-gray-600">Nutrition targets</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Calories Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-700">Calories</span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {totalCalories} / {targetDayCalories}
              </span>
            </div>
            <Progress value={calorieProgress} className="h-3 bg-gray-200" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(calorieProgress)}% complete</span>
              <span>{targetDayCalories - totalCalories} remaining</span>
            </div>
          </div>

          {/* Protein Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-gray-700">Protein</span>
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {totalProtein.toFixed(1)}g / {proteinTarget}g
              </span>
            </div>
            <Progress value={proteinProgress} className="h-3 bg-gray-200" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(proteinProgress)}% complete</span>
              <span>{(proteinTarget - totalProtein).toFixed(1)}g remaining</span>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Quick Actions</h3>
              <p className="text-sm text-gray-600">Meal management</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full justify-start bg-white hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Snack
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full justify-start bg-white hover:bg-gray-50"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="w-full justify-start bg-white hover:bg-gray-50"
          >
            <Clock className="w-4 h-4 mr-2" />
            Set Reminders
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlanStatsPanel;
