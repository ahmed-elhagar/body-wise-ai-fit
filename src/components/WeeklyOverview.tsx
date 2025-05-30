
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar } from "lucide-react";

interface DayOverview {
  day: string;
  calories: number;
  status: 'completed' | 'current' | 'planned';
}

interface WeeklyOverviewProps {
  weeklyData: DayOverview[];
  totalWeeklyCalories?: number;
  totalWeeklyProtein?: number;
  totalMeals?: number;
}

const WeeklyOverview = ({ 
  weeklyData, 
  totalWeeklyCalories = 0, 
  totalWeeklyProtein = 0, 
  totalMeals = 0 
}: WeeklyOverviewProps) => {
  return (
    <div className="space-y-4">
      {/* Enhanced Stats Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Total Calories</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                {totalWeeklyCalories}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Total Protein</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                {totalWeeklyProtein}g
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Total Meals</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                {totalMeals}
              </Badge>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Daily Average
              </span>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {Math.round(totalWeeklyCalories / 7)}
              </div>
              <div className="text-xs text-gray-500">calories/day</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Progress Grid */}
      <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day, index) => (
              <div
                key={index}
                className={`text-center p-3 rounded-xl transition-all duration-200 ${
                  day.status === 'current' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105' 
                    : day.status === 'completed'
                    ? 'bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <p className="font-semibold text-xs mb-1">{day.day}</p>
                <p className="text-xs">{day.calories}</p>
                <p className="text-xs opacity-80">cal</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyOverview;
