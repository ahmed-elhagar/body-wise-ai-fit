
import { useMemo, useState, useCallback } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isValid, isSameDay } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, TrendingUp, Target, Activity, Utensils } from "lucide-react";

interface FoodConsumptionLog {
  id: string;
  user_id: string;
  food_item_id: string;
  quantity_g: number;
  meal_type: string;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fat_consumed: number;
  consumed_at: string;
  meal_image_url?: string;
  notes?: string;
  source: string;
  ai_analysis_data?: any;
  food_item?: {
    id: string;
    name: string;
    brand?: string;
    category: string;
    serving_description?: string;
  };
}

interface OptimizedNutritionHeatMapProps {
  data: FoodConsumptionLog[];
  currentMonth: Date;
}

interface DayData {
  date: Date;
  dateStr: string;
  dayName: string;
  dayNumber: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalEntries: number;
  intensity: number;
  meals: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snack: number;
  };
  avgCaloriesPerMeal: number;
}

// Memoized Day Card Component - Ultra compact for left side
const DayCard = ({ 
  day, 
  selectedDay, 
  onDayClick 
}: { 
  day: DayData; 
  selectedDay: DayData | null; 
  onDayClick: (day: DayData) => void;
}) => {
  const getIntensityColor = useCallback((intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-400';
      case 1: return 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700';
      case 2: return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800';
      case 3: return 'bg-green-200 hover:bg-green-300 border-green-400 text-green-900';
      case 4: return 'bg-green-300 hover:bg-green-400 border-green-500 text-green-900';
      default: return 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-400';
    }
  }, []);

  const isSelected = selectedDay?.dateStr === day.dateStr;
  const hasEntries = day.totalEntries > 0;

  return (
    <div
      className={`
        w-5 h-5 rounded flex items-center justify-center text-[10px] font-medium border transition-all duration-200
        ${getIntensityColor(day.intensity)}
        ${hasEntries ? 'cursor-pointer hover:scale-110 hover:shadow-sm' : ''}
        ${isSelected ? 'ring-1 ring-blue-500 shadow-md scale-110' : ''}
      `}
      title={`${day.dateStr}: ${day.totalCalories} cal, ${day.totalEntries} entries`}
      onClick={() => hasEntries && onDayClick(day)}
    >
      <div className="font-semibold leading-none">{day.dayNumber}</div>
    </div>
  );
};

const OptimizedNutritionHeatMap = ({ data, currentMonth }: OptimizedNutritionHeatMapProps) => {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  // Memoized streak calculation
  const calculateStreak = useCallback((days: DayData[]) => {
    let streak = 0;
    const today = new Date();
    
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      if (day.date > today) continue;
      
      if (day.totalEntries > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, []);

  // Optimized data processing with memoization
  const { heatMapData, hasErrors, monthlyStats } = useMemo(() => {
    try {
      console.log('🗓️ Processing optimized heat map data for:', format(currentMonth, 'yyyy-MM'));
      
      if (!data || data.length === 0) {
        return {
          heatMapData: [],
          hasErrors: false,
          monthlyStats: { totalCaloriesMonth: 0, avgDailyCalories: 0, avgDailyProtein: 0, activeDays: 0, streak: 0 }
        };
      }

      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

      let errorCount = 0;

      // Group data by date for better performance
      const dataByDate = data.reduce((acc, entry) => {
        try {
          if (!entry?.consumed_at) return acc;
          
          const entryDate = new Date(entry.consumed_at);
          if (!isValid(entryDate)) {
            errorCount++;
            return acc;
          }
          
          const entryDayStr = format(entryDate, 'yyyy-MM-dd');
          if (!acc[entryDayStr]) acc[entryDayStr] = [];
          acc[entryDayStr].push(entry);
          
          return acc;
        } catch (error) {
          errorCount++;
          return acc;
        }
      }, {} as Record<string, FoodConsumptionLog[]>);

      const processedData = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayData = dataByDate[dayStr] || [];

        const totalCalories = dayData.reduce((sum, entry) => {
          const calories = entry.calories_consumed || 0;
          return sum + (typeof calories === 'number' && !isNaN(calories) ? calories : 0);
        }, 0);

        const totalProtein = dayData.reduce((sum, entry) => sum + (entry.protein_consumed || 0), 0);
        const totalCarbs = dayData.reduce((sum, entry) => sum + (entry.carbs_consumed || 0), 0);
        const totalFat = dayData.reduce((sum, entry) => sum + (entry.fat_consumed || 0), 0);
        const totalEntries = dayData.length;

        // Count meals by type
        const meals = {
          breakfast: dayData.filter(entry => entry.meal_type === 'breakfast').length,
          lunch: dayData.filter(entry => entry.meal_type === 'lunch').length,
          dinner: dayData.filter(entry => entry.meal_type === 'dinner').length,
          snack: dayData.filter(entry => entry.meal_type === 'snack').length,
        };

        // Calculate intensity (0-4 scale)
        let intensity = 0;
        if (totalCalories > 0) {
          if (totalCalories >= 2500) intensity = 4;
          else if (totalCalories >= 2000) intensity = 3;
          else if (totalCalories >= 1500) intensity = 2;
          else if (totalCalories >= 1000) intensity = 1;
        }

        return {
          date: day,
          dateStr: dayStr,
          dayName: format(day, 'EEE'),
          dayNumber: format(day, 'd'),
          totalCalories: Math.round(totalCalories),
          totalProtein: Math.round(totalProtein),
          totalCarbs: Math.round(totalCarbs),
          totalFat: Math.round(totalFat),
          totalEntries,
          intensity,
          meals,
          avgCaloriesPerMeal: totalEntries > 0 ? Math.round(totalCalories / totalEntries) : 0
        };
      });

      // Calculate monthly statistics
      const validDays = processedData.filter(day => day.totalEntries > 0);
      const totalCaloriesMonth = validDays.reduce((sum, day) => sum + day.totalCalories, 0);
      const totalProteinMonth = validDays.reduce((sum, day) => sum + day.totalProtein, 0);
      const avgDailyCalories = validDays.length > 0 ? Math.round(totalCaloriesMonth / validDays.length) : 0;
      const avgDailyProtein = validDays.length > 0 ? Math.round(totalProteinMonth / validDays.length) : 0;
      const streak = calculateStreak(processedData);

      return {
        heatMapData: processedData,
        hasErrors: errorCount > 0,
        monthlyStats: {
          totalCaloriesMonth,
          avgDailyCalories,
          avgDailyProtein,
          activeDays: validDays.length,
          streak
        }
      };
    } catch (error) {
      console.error('❌ Error processing optimized heat map data:', error);
      return {
        heatMapData: [],
        hasErrors: true,
        monthlyStats: { totalCaloriesMonth: 0, avgDailyCalories: 0, avgDailyProtein: 0, activeDays: 0, streak: 0 }
      };
    }
  }, [data, currentMonth, calculateStreak]);

  const handleDayClick = useCallback((day: DayData) => {
    setSelectedDay(selectedDay?.dateStr === day.dateStr ? null : day);
  }, [selectedDay]);

  if (hasErrors) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Some data entries have formatting issues and may not be displayed correctly.
        </AlertDescription>
      </Alert>
    );
  }

  if (heatMapData.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">No data available for this month.</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Left Side - Compact Calendar */}
      <div className="flex-shrink-0">
        <div className="bg-white rounded-lg border p-3 shadow-sm">
          {/* Compact Calendar Header */}
          <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="text-[9px] font-medium text-gray-500 py-1 w-5">
                {day}
              </div>
            ))}
          </div>
          
          {/* Compact Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {heatMapData.map((day) => (
              <DayCard
                key={day.dateStr}
                day={day}
                selectedDay={selectedDay}
                onDayClick={handleDayClick}
              />
            ))}
          </div>

          {/* Mini Legend */}
          <div className="flex items-center justify-center gap-1 mt-3">
            <span className="text-[9px] text-gray-500">Less</span>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map(intensity => (
                <div
                  key={intensity}
                  className={`w-1.5 h-1.5 rounded-sm border ${
                    intensity === 0 ? 'bg-gray-100 border-gray-200' :
                    intensity === 1 ? 'bg-green-100 border-green-300' :
                    intensity === 2 ? 'bg-green-200 border-green-400' :
                    intensity === 3 ? 'bg-green-300 border-green-500' :
                    'bg-green-400 border-green-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] text-gray-500">More</span>
          </div>
        </div>
      </div>

      {/* Right Side - Data Display */}
      <div className="flex-1 space-y-4">
        {/* Monthly Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Active Days</span>
            </div>
            <div className="text-xl font-bold text-green-900">{monthlyStats.activeDays}</div>
            <div className="text-xs text-green-600">days logged</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Avg Calories</span>
            </div>
            <div className="text-xl font-bold text-blue-900">{monthlyStats.avgDailyCalories}</div>
            <div className="text-xs text-blue-600">per day</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Avg Protein</span>
            </div>
            <div className="text-xl font-bold text-purple-900">{monthlyStats.avgDailyProtein}g</div>
            <div className="text-xs text-purple-600">per day</div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-orange-600 rounded-full" />
              <span className="text-sm font-medium text-orange-700">Streak</span>
            </div>
            <div className="text-xl font-bold text-orange-900">{monthlyStats.streak}</div>
            <div className="text-xs text-orange-600">days in a row</div>
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDay ? (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                {format(selectedDay.date, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedDay.totalCalories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedDay.totalProtein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedDay.totalCarbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedDay.totalFat}g</div>
                  <div className="text-sm text-gray-600">Fat</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Meals:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDay.meals.breakfast > 0 && (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      🌅 {selectedDay.meals.breakfast}
                    </Badge>
                  )}
                  {selectedDay.meals.lunch > 0 && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      🍽️ {selectedDay.meals.lunch}
                    </Badge>
                  )}
                  {selectedDay.meals.dinner > 0 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      🌙 {selectedDay.meals.dinner}
                    </Badge>
                  )}
                  {selectedDay.meals.snack > 0 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      🍎 {selectedDay.meals.snack}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-gray-300">
            <CardContent className="py-8">
              <div className="text-center">
                <Utensils className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Day</h3>
                <p className="text-gray-500">Click on any day with food logs to see detailed nutrition information</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OptimizedNutritionHeatMap;
