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
    <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {getDayName(selectedDay)} Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="flex items-center gap-2 font-semibold text-gray-700">
              <Flame className="h-4 w-4 text-orange-500" />
              Calories
            </span>
            <span className="font-bold text-gray-900">{totalCalories} / {targetDayCalories}</span>
          </div>
          <Progress 
            value={calorieProgress} 
            className="h-3 bg-gray-200"
            style={{
              '--progress-background': 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            } as any}
          />
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {Math.round(calorieProgress)}%
            </div>
            <div className="text-xs text-gray-500">of daily goal</div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <span className="flex items-center gap-2 font-semibold text-green-900">
              <Target className="h-4 w-4 text-green-600" />
              Protein
            </span>
            <span className="font-bold text-green-700">{totalProtein.toFixed(1)}g</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanStatsCard;
