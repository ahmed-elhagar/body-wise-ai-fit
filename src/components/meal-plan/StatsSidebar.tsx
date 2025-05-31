
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, Utensils, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatsSidebarProps {
  todaysMeals: any[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
}

const StatsSidebar = ({ todaysMeals, totalCalories, totalProtein, targetDayCalories }: StatsSidebarProps) => {
  const { t } = useLanguage();

  const calorieProgress = targetDayCalories > 0 ? Math.min((totalCalories / targetDayCalories) * 100, 100) : 0;
  const proteinTarget = 150; // Default protein target
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Today's Summary */}
      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium opacity-90">Calories</span>
              <span className="text-sm font-medium opacity-90">{Math.round(calorieProgress)}%</span>
            </div>
            <Progress value={calorieProgress} className="h-2 bg-white/20" />
            <div className="flex justify-between text-sm mt-2 font-medium">
              <span>{totalCalories}</span>
              <span>{targetDayCalories}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Protein Goal */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5" />
            Protein Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold">{totalProtein.toFixed(1)}g</div>
            <div className="text-sm opacity-90">of {proteinTarget}g target</div>
            <Progress value={proteinProgress} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Meals Today */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Meals Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold">{todaysMeals.length}</div>
            <div className="text-sm opacity-90">Planned Meals</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avg per meal</span>
            <span className="font-medium text-gray-900">
              {todaysMeals.length > 0 ? Math.round(totalCalories / todaysMeals.length) : 0} cal
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Remaining</span>
            <span className="font-medium text-gray-900">
              {Math.max(0, targetDayCalories - totalCalories)} cal
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="font-medium text-green-600">
              {Math.round(calorieProgress)}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSidebar;
