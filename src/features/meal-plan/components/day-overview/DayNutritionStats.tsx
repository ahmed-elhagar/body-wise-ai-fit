
import { CardContent } from "@/components/ui/card";
import { Award, TrendingUp } from "lucide-react";

interface DayNutritionStatsProps {
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  dailyMealsCount: number;
}

export const DayNutritionStats = ({
  totalCalories,
  totalProtein,
  targetDayCalories,
  dailyMealsCount,
}: DayNutritionStatsProps) => {
  const progressPercentage = Math.min(100, (totalCalories / targetDayCalories) * 100);
  const remainingCalories = Math.max(0, targetDayCalories - totalCalories);
  const proteinTarget = Math.round(targetDayCalories * 0.3 / 4); // 30% of calories from protein
  const proteinProgress = Math.min(100, (totalProtein / proteinTarget) * 100);

  return (
    <CardContent>
      {/* Enhanced Nutrition Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{totalCalories}</div>
          <div className="text-sm text-gray-600 mb-2">Calories</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {remainingCalories} remaining of {targetDayCalories}
          </div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-green-600">{totalProtein}g</div>
          <div className="text-sm text-gray-600 mb-2">Protein</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${proteinProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Target: {proteinTarget}g
          </div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{dailyMealsCount}</div>
          <div className="text-sm text-gray-600">Meals Planned</div>
          <div className="flex items-center justify-center mt-2">
            <Award className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-xs text-blue-600">
              {dailyMealsCount >= 3 ? 'Complete' : 'In Progress'}
            </span>
          </div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg border shadow-sm">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(progressPercentage)}%
          </div>
          <div className="text-sm text-gray-600">Daily Goal</div>
          <div className="flex items-center justify-center mt-2">
            <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
            <span className="text-xs text-purple-600">
              {progressPercentage >= 80 ? 'On Track' : 'Need More'}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  );
};
