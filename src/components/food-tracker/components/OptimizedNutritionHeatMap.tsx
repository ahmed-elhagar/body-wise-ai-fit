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

// Enhanced Day Card Component - Smaller for compact layout
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
        w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium border transition-all duration-200
        ${getIntensityColor(day.intensity)}
        ${hasEntries ? 'cursor-pointer hover:scale-105 hover:shadow-md' : ''}
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-105' : ''}
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
    <div className="space-y-6">
      {/* Main Layout - Calendar and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compact Calendar - Takes 1/3 of the width */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4 shadow-sm h-fit">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 text-center mb-3">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid - Compact */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {heatMapData.map((day) => (
                <DayCard
                  key={day.dateStr}
                  day={day}
                  selectedDay={selectedDay}
                  onDayClick={handleDayClick}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-gray-500">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(intensity => (
                  <div
                    key={intensity}
                    className={`w-2 h-2 rounded border ${
                      intensity === 0 ? 'bg-gray-100 border-gray-200' :
                      intensity === 1 ? 'bg-green-100 border-green-300' :
                      intensity === 2 ? 'bg-green-200 border-green-400' :
                      intensity === 3 ? 'bg-green-300 border-green-500' :
                      'bg-green-400 border-green-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">More</span>
            </div>
          </div>
        </div>

        {/* Compact Monthly Stats - Takes 2/3 of the width, 2x2 Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-fit">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-6 h-6 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Active Days</span>
              </div>
              <div className="text-2xl font-bold text-green-900 mb-1">{monthlyStats.activeDays}</div>
              <div className="text-xs text-green-600">days with food logs</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Avg Calories</span>
              </div>
              <div className="text-2xl font-bold text-blue-900 mb-1">{monthlyStats.avgDailyCalories}</div>
              <div className="text-xs text-blue-600">calories per day</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">Avg Protein</span>
              </div>
              <div className="text-2xl font-bold text-purple-900 mb-1">{monthlyStats.avgDailyProtein}g</div>
              <div className="text-xs text-purple-600">protein per day</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">🔥</span>
                </div>
                <span className="text-sm font-semibold text-orange-700">Streak</span>
              </div>
              <div className="text-2xl font-bold text-orange-900 mb-1">{monthlyStats.streak}</div>
              <div className="text-xs text-orange-600">consecutive days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Details - Full Width Below */}
      {selectedDay ? (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              {format(selectedDay.date, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{selectedDay.totalCalories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{selectedDay.totalProtein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{selectedDay.totalCarbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{selectedDay.totalFat}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-medium text-gray-700">Meals:</h4>
              <div className="flex flex-wrap gap-3">
                {selectedDay.meals.breakfast > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-sm py-2 px-3">
                    🌅 Breakfast ({selectedDay.meals.breakfast})
                  </Badge>
                )}
                {selectedDay.meals.lunch > 0 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-sm py-2 px-3">
                    🍽️ Lunch ({selectedDay.meals.lunch})
                  </Badge>
                )}
                {selectedDay.meals.dinner > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm py-2 px-3">
                    🌙 Dinner ({selectedDay.meals.dinner})
                  </Badge>
                )}
                {selectedDay.meals.snack > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-sm py-2 px-3">
                    🍎 Snacks ({selectedDay.meals.snack})
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-gray-300">
          <CardContent className="py-12">
            <div className="text-center">
              <Utensils className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-3">Select a Day</h3>
              <p className="text-gray-500">Click on any day with food logs to see detailed nutrition information</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptimizedNutritionHeatMap;
