import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Award,
  Calendar,
  Clock
} from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface QuickStatsCardProps {
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  mealCount: number;
}

const QuickStatsCard = ({
  totalCalories,
  totalProtein,
  targetDayCalories,
  mealCount
}: QuickStatsCardProps) => {
  const { mealPlanT } = useMealPlanTranslation();
  
  const caloriesProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / 150) * 100, 100); // Assuming 150g target
  
  return (
    <Card className="bg-gradient-to-br from-white to-fitness-neutral-50 shadow-xl border-2 border-fitness-primary-100 hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-fitness-primary-700">
          <TrendingUp className="w-5 h-5" />
          {mealPlanT('dailyProgress') || 'Daily Progress'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Calories Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-fitness-primary-600" />
              <span className="text-sm font-medium text-gray-700">
                {mealPlanT('calories') || 'Calories'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-fitness-primary-700">
                {totalCalories}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                / {targetDayCalories}
              </span>
            </div>
          </div>
          <Progress 
            value={caloriesProgress} 
            className="h-3 bg-fitness-primary-100"
          />
          <div className="text-xs text-gray-500 text-center">
            {caloriesProgress.toFixed(0)}% of daily target
          </div>
        </div>

        {/* Protein Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-fitness-secondary-600" />
              <span className="text-sm font-medium text-gray-700">
                {mealPlanT('protein')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-fitness-secondary-700">
                {totalProtein.toFixed(1)}g
              </span>
              <span className="text-sm text-gray-500 ml-1">
                / 150g
              </span>
            </div>
          </div>
          <Progress 
            value={proteinProgress} 
            className="h-3 bg-fitness-secondary-100"
          />
          <div className="text-xs text-gray-500 text-center">
            {proteinProgress.toFixed(0)}% of daily target
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-fitness-primary-100">
          <div className="text-center p-3 bg-fitness-primary-50 rounded-xl">
            <Calendar className="w-5 h-5 text-fitness-primary-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-fitness-primary-700">
              {mealCount}
            </div>
            <div className="text-xs text-fitness-primary-600 font-medium">
              {mealPlanT('mealsToday') || 'Meals Today'}
            </div>
          </div>
          
          <div className="text-center p-3 bg-fitness-accent-50 rounded-xl">
            <Award className="w-5 h-5 text-fitness-accent-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-fitness-accent-700">
              {Math.round(caloriesProgress)}%
            </div>
            <div className="text-xs text-fitness-accent-600 font-medium">
              {mealPlanT('complete') || 'Complete'}
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-4 bg-gradient-to-r from-fitness-primary-50 to-fitness-secondary-50 rounded-xl border border-fitness-primary-200">
          <div className="text-sm font-medium text-fitness-primary-700">
            {caloriesProgress >= 100 
              ? "🎉 Daily goal achieved!" 
              : caloriesProgress >= 75 
              ? "💪 Almost there, keep going!" 
              : caloriesProgress >= 50 
              ? "🔥 Halfway to your goal!" 
              : "🌟 Great start, let's continue!"
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
