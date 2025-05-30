
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Target, TrendingUp } from "lucide-react";

interface MealPlanStatsCardProps {
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  selectedDay: number;
}

const MealPlanStatsCard = ({
  totalCalories,
  totalProtein,
  targetDayCalories,
  selectedDay
}: MealPlanStatsCardProps) => {
  const calorieProgress = targetDayCalories > 0 ? (totalCalories / targetDayCalories) * 100 : 0;
  
  const getDayName = (dayNumber: number) => {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber] || 'Day';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          {getDayName(selectedDay)} Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              Calories
            </span>
            <span className="font-medium">{totalCalories} / {targetDayCalories}</span>
          </div>
          <Progress value={calorieProgress} className="h-2" />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <Target className="h-3 w-3 text-green-500" />
            Protein
          </span>
          <span className="font-medium">{totalProtein.toFixed(1)}g</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanStatsCard;
