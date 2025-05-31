
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatsSidebarProps {
  todaysMeals: any[];
  totalCalories: number;
  totalProtein: number;
  targetDayCalories: number;
}

const StatsSidebar = ({ todaysMeals, totalCalories, totalProtein, targetDayCalories }: StatsSidebarProps) => {
  const { t } = useLanguage();

  const calorieProgress = targetDayCalories > 0 ? (totalCalories / targetDayCalories) * 100 : 0;

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-sm rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Flame className="w-4 h-4" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm opacity-90">Calories</span>
                <span className="text-sm opacity-90">{Math.round(calorieProgress)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="font-medium">{totalCalories}</span>
                <span>{targetDayCalories}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-sm rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Target className="w-4 h-4" />
            Protein Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-xl font-medium">{totalProtein.toFixed(1)}g</div>
            <div className="text-sm opacity-90">Total Protein</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-sm rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Meals Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-xl font-medium">{todaysMeals.length}</div>
            <div className="text-sm opacity-90">Planned Meals</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsSidebar;
