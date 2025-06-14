import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, History, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFoodConsumption, FoodConsumptionLog } from "@/features/food-tracker/hooks";
import VirtualizedMealHistory from "@/components/food-tracker/components/VirtualizedMealHistory";
import NutritionHeatMap from "@/components/food-tracker/components/NutritionHeatMap";
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from "date-fns";

const HistoryTab = () => {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Ensure useHistoryData is correctly destructured if it's a hook itself, or used as a method
  const { data: historyData, isLoading } = useFoodConsumption().useHistoryData(monthStart, monthEnd);

  // Group data by date for timeline view
  const groupedHistory = (historyData || []).reduce((acc, entry) => {
    const date = format(new Date(entry.consumed_at), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, FoodConsumptionLog[]>); // Corrected accumulator type

  const groupedArray: { date: string; entries: FoodConsumptionLog[] }[] = Object.entries(groupedHistory)
    .map(([date, entries]) => ({ date, entries }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate monthly stats
  const monthlyStats = (historyData || []).reduce(
    (acc, entry) => ({
      totalCalories: acc.totalCalories + (entry.calories_consumed || 0),
      totalProtein: acc.totalProtein + (entry.protein_consumed || 0),
      totalEntries: acc.totalEntries + 1,
    }),
    { totalCalories: 0, totalProtein: 0, totalEntries: 0 }
  ) || { totalCalories: 0, totalProtein: 0, totalEntries: 0 };

  const activeDays = Object.keys(groupedHistory).length;
  const avgDailyCalories = activeDays > 0 ? Math.round(monthlyStats.totalCalories / activeDays) : 0;

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Month Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl text-gray-900">Nutrition History</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Track your eating patterns and progress over time
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Monthly Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Avg Daily:</span>
                <Badge variant="outline">{avgDailyCalories} cal</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Active Days:</span>
                <Badge variant="outline">{activeDays}</Badge>
              </div>
            </div>
          </div>

          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Calories</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {Math.round(monthlyStats.totalCalories).toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                  🔥
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Protein</p>
                  <p className="text-2xl font-bold text-green-900">
                    {Math.round(monthlyStats.totalProtein)}g
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  💪
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Meals Logged</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {monthlyStats.totalEntries}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                  🍽️
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on view mode */}
      {viewMode === 'timeline' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              Daily Food Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VirtualizedMealHistory groupedHistory={groupedArray} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              Nutrition Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NutritionHeatMap data={historyData || []} currentMonth={currentMonth} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HistoryTab;
