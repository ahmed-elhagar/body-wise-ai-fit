
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Utensils, Zap, Calendar, Target } from "lucide-react";

interface NutritionStatsGridProps {
  totalCalories: number;
  targetDayCalories: number;
  totalProtein: number;
  proteinTarget: number;
  mealsPlanned: number;
  hasWeeklyPlan: boolean;
}

export const NutritionStatsGrid = ({
  totalCalories,
  targetDayCalories,
  totalProtein,
  proteinTarget,
  mealsPlanned,
  hasWeeklyPlan
}: NutritionStatsGridProps) => {
  const calorieProgress = targetDayCalories > 0 ? Math.min(100, (totalCalories / targetDayCalories) * 100) : 0;
  const proteinProgress = proteinTarget > 0 ? Math.min(100, (totalProtein / proteinTarget) * 100) : 0;

  const nutritionStats = [
    {
      label: "Daily Calories",
      current: totalCalories,
      target: targetDayCalories,
      unit: "cal",
      progress: calorieProgress,
      icon: Utensils,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      label: "Protein Intake",
      current: totalProtein,
      target: proteinTarget,
      unit: "g",
      progress: proteinProgress,
      icon: Zap,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Meals Planned",
      current: mealsPlanned,
      target: 3,
      unit: "meals",
      progress: (mealsPlanned / 3) * 100,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      label: "Weekly Plan",
      current: hasWeeklyPlan ? 1 : 0,
      target: 1,
      unit: "plan",
      progress: hasWeeklyPlan ? 100 : 0,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {nutritionStats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={index} className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-all duration-300`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <IconComponent className={`w-5 h-5 ${stat.color}`} />
                <Badge variant="outline" className="text-xs">
                  {Math.round(stat.progress)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">{stat.label}</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{stat.current}</span>
                  <span className="text-sm text-gray-500">/ {stat.target} {stat.unit}</span>
                </div>
                <Progress value={stat.progress} className="h-1" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
