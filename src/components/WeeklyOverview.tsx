
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, Flame } from "lucide-react";

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
      <Card className="bg-gradient-to-br from-white to-blue-50/50 border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <TrendingUp className="h-6 w-6" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-900">Total Calories</span>
              </div>
              <Badge className="bg-blue-600 text-white border-0 px-3 py-1 font-bold">
                {totalWeeklyCalories}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-900">Total Protein</span>
              </div>
              <Badge className="bg-green-600 text-white border-0 px-3 py-1 font-bold">
                {totalWeeklyProtein}g
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-900">Total Meals</span>
              </div>
              <Badge className="bg-purple-600 text-white border-0 px-3 py-1 font-bold">
                {totalMeals}
              </Badge>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Daily Average
              </span>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round(totalWeeklyCalories / 7)}
              </div>
              <div className="text-sm text-gray-600 font-medium">calories/day</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Progress Grid */}
      <Card className="bg-gradient-to-br from-white to-green-50/50 border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <Calendar className="h-6 w-6" />
            Daily Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-3">
            {weeklyData.map((day, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-2xl transition-all duration-300 shadow-lg ${
                  day.status === 'current' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl scale-110 transform' 
                    : day.status === 'completed'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <p className="font-bold text-xs mb-2">{day.day}</p>
                <p className="text-sm font-semibold">{day.calories}</p>
                <p className="text-xs opacity-90">cal</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyOverview;
