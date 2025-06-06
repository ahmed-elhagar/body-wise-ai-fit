
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, Plus } from "lucide-react";
import { format, addDays } from "date-fns";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface DayOverviewSectionProps {
  selectedDayNumber: number;
  weekStartDate: Date;
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
  mealsCount: number;
  onAddSnack: () => void;
}

const DayOverviewSection = ({
  selectedDayNumber,
  weekStartDate,
  totalCalories,
  totalProtein,
  targetDayCalories,
  mealsCount,
  onAddSnack
}: DayOverviewSectionProps) => {
  const { mealPlanT } = useMealPlanTranslation();
  
  const selectedDate = addDays(weekStartDate, selectedDayNumber - 1);
  const calorieProgress = Math.min((totalCalories / targetDayCalories) * 100, 100);
  const proteinTarget = 150;
  const proteinProgress = Math.min((totalProtein / proteinTarget) * 100, 100);

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-25 to-fitness-accent-25 border-fitness-primary-200 shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-fitness-primary-800">
                Day {selectedDayNumber} - {format(selectedDate, 'EEEE')}
              </h2>
              <p className="text-fitness-primary-600 text-sm">
                {format(selectedDate, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-fitness-primary-100 text-fitness-primary-700 border-fitness-primary-200 px-2 py-1 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              {mealsCount} meals
            </Badge>
            <Badge 
              className={`px-2 py-1 text-xs ${
                calorieProgress >= 80 
                  ? 'bg-green-100 text-green-700 border-green-200' 
                  : 'bg-orange-100 text-orange-700 border-orange-200'
              }`}
            >
              <Target className="w-3 h-3 mr-1" />
              {Math.round(calorieProgress)}% complete
            </Badge>
            <Button
              onClick={onAddSnack}
              size="xs"
              variant="accent"
              className="shadow-sm px-2 py-1 h-6 text-xs font-medium"
            >
              <Plus className="w-3 h-3 mr-1" />
              {mealPlanT('addSnack')}
            </Button>
          </div>
        </div>

        {/* Nutrition Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-fitness-primary-700">Calories</span>
              <span className="text-lg font-bold text-fitness-accent-600">
                {totalCalories} / {targetDayCalories}
              </span>
            </div>
            <Progress 
              value={calorieProgress} 
              className="h-3 bg-gray-200"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(calorieProgress)}% of target</span>
              <span>{targetDayCalories - totalCalories} remaining</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-fitness-primary-700">Protein</span>
              <span className="text-lg font-bold text-fitness-accent-600">
                {totalProtein.toFixed(1)}g / {proteinTarget}g
              </span>
            </div>
            <Progress 
              value={proteinProgress} 
              className="h-3 bg-gray-200"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(proteinProgress)}% of target</span>
              <span>{(proteinTarget - totalProtein).toFixed(1)}g remaining</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DayOverviewSection;
