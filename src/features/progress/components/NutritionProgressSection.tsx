import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMealPlanState } from "@/features/meal-plan/hooks";
import { useFoodConsumption } from "@/features/food-tracker/hooks";
import { NutritionStatsGrid } from "./nutrition/NutritionStatsGrid";
import { TodayNutritionSummary } from "./nutrition/TodayNutritionSummary";
import { WeeklyNutritionChart } from "./nutrition/WeeklyNutritionChart";

const NutritionProgressSection = () => {
  const navigate = useNavigate();
  const { 
    currentWeekPlan, 
    totalCalories, 
    totalProtein, 
    targetDayCalories,
    dailyMeals 
  } = useMealPlanState();
  
  const { todayConsumption } = useFoodConsumption();

  // Calculate nutrition metrics
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4); // 30% of calories from protein
  const mealsPlanned = dailyMeals?.length || 0;

  return (
    <div className="space-y-6">
      {/* Nutrition Stats Grid */}
      <NutritionStatsGrid 
        totalCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        totalProtein={totalProtein}
        proteinTarget={proteinTarget}
        mealsPlanned={mealsPlanned}
        hasWeeklyPlan={!!currentWeekPlan}
      />

      {/* Today's Nutrition Overview */}
      <TodayNutritionSummary 
        totalCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        totalProtein={totalProtein}
        proteinTarget={proteinTarget}
        mealsPlanned={mealsPlanned}
      />

      {/* Weekly Nutrition Chart */}
      <WeeklyNutritionChart 
        totalCalories={totalCalories}
        targetDayCalories={targetDayCalories}
        totalProtein={totalProtein}
      />

      {/* Meal Plan Status */}
      {currentWeekPlan && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Calendar className="w-5 h-5" />
              Current Meal Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-700 font-medium">Plan Status</span>
              <Badge className="bg-blue-600 text-white">Active</Badge>
            </div>
            <div className="text-sm text-blue-600">
              You have an active meal plan with {currentWeekPlan.dailyMeals?.length || 0} meals planned
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => navigate('/food-tracker')}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Track Food
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/meal-plan')}
          className="border-green-300 text-green-700 hover:bg-green-50"
        >
          <Calendar className="w-4 h-4 mr-2" />
          View Meal Plan
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/calorie-checker')}
          className="border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <Zap className="w-4 h-4 mr-2" />
          Scan Food
        </Button>
      </div>
    </div>
  );
};

export default NutritionProgressSection;
