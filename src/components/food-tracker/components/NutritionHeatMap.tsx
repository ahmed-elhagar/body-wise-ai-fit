
import { useMemo, useState } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isValid, isSameDay } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, TrendingUp, Target, Activity } from "lucide-react";

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

interface NutritionHeatMapProps {
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

const NutritionHeatMap = ({ data, currentMonth }: NutritionHeatMapProps) => {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const { heatMapData, hasErrors, monthlyStats } = useMemo(() => {
    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

      let errorCount = 0;

      const processedData = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        
        // Filter and validate data for this day
        const dayData = data.filter(entry => {
          try {
            if (!entry || !entry.consumed_at) return false;
            
            const entryDate = new Date(entry.consumed_at);
            if (!isValid(entryDate)) {
              errorCount++;
              return false;
            }
            
            const entryDayStr = format(entryDate, 'yyyy-MM-dd');
            return entryDayStr === dayStr;
          } catch {
            errorCount++;
            return false;
          }
        });

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

        // Calculate intensity based on calories (0-4 scale)
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
      console.error('Error processing heat map data:', error);
      return {
        heatMapData: [],
        hasErrors: true,
        monthlyStats: { totalCaloriesMonth: 0, avgDailyCalories: 0, avgDailyProtein: 0, activeDays: 0, streak: 0 }
      };
    }
  }, [data, currentMonth]);

  const calculateStreak = (days: DayData[]) => {
    let streak = 0;
    const today = new Date();
    
    // Start from today and go backwards
    for (let i = days.length - 1; i >= 0; i--) {
      const day = days[i];
      if (day.date > today) continue; // Skip future dates
      
      if (day.totalEntries > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-gray-100 hover:bg-gray-200 border-gray-200';
      case 1: return 'bg-green-100 hover:bg-green-200 border-green-300';
      case 2: return 'bg-green-200 hover:bg-green-300 border-green-400';
      case 3: return 'bg-green-300 hover:bg-green-400 border-green-500';
      case 4: return 'bg-green-400 hover:bg-green-500 border-green-600';
      default: return 'bg-gray-100 hover:bg-gray-200 border-gray-200';
    }
  };

  const handleDayClick = (day: DayData) => {
    if (day.totalEntries > 0) {
      setSelectedDay(selectedDay?.dateStr === day.dateStr ? null : day);
    }
  };

  if (hasErrors) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some data entries have formatting issues and may not be displayed correctly in the calendar.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (heatMapData.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Unable to load calendar data for this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Monthly Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Activity className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-2xl font-bold text-green-600">{monthlyStats.activeDays}</span>
          </div>
          <p className="text-sm text-gray-600">Active Days</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-blue-600">{monthlyStats.avgDailyCalories}</span>
          </div>
          <p className="text-sm text-gray-600">Avg Daily Calories</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{monthlyStats.avgDailyProtein}g</div>
          <p className="text-sm text-gray-600">Avg Daily Protein</p>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-2xl font-bold text-orange-600">{monthlyStats.streak}</span>
          </div>
          <p className="text-sm text-gray-600">Current Streak</p>
        </Card>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {heatMapData.map((day) => (
          <div
            key={day.dateStr}
            className={`
              aspect-square rounded-md flex flex-col items-center justify-center text-xs font-medium border
              ${getIntensityColor(day.intensity)}
              ${day.totalEntries > 0 ? 'text-gray-800 cursor-pointer hover:ring-2 hover:ring-green-400' : 'text-gray-500'}
              ${selectedDay?.dateStr === day.dateStr ? 'ring-2 ring-blue-500' : ''}
              transition-all duration-200 transform hover:scale-105
            `}
            title={`${day.dateStr}: ${day.totalCalories} calories, ${day.totalEntries} entries`}
            onClick={() => handleDayClick(day)}
          >
            <div className="font-semibold">{day.dayNumber}</div>
            {day.totalEntries > 0 && (
              <div className="text-xs opacity-75">{day.totalEntries}</div>
            )}
          </div>
        ))}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              {format(selectedDay.date, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-green-600">{selectedDay.totalCalories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{selectedDay.totalProtein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{selectedDay.totalCarbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{selectedDay.totalFat}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Meal Breakdown:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDay.meals.breakfast > 0 && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    🌅 {selectedDay.meals.breakfast} Breakfast
                  </Badge>
                )}
                {selectedDay.meals.lunch > 0 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    🍽️ {selectedDay.meals.lunch} Lunch
                  </Badge>
                )}
                {selectedDay.meals.dinner > 0 && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    🌙 {selectedDay.meals.dinner} Dinner
                  </Badge>
                )}
                {selectedDay.meals.snack > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    🍎 {selectedDay.meals.snack} Snacks
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Average {selectedDay.avgCaloriesPerMeal} calories per meal
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-600">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(intensity => (
              <div
                key={intensity}
                className={`w-3 h-3 rounded-sm border ${getIntensityColor(intensity).split(' ')[0]} ${getIntensityColor(intensity).split(' ')[2]}`}
                title={`${intensity === 0 ? '0' : intensity === 1 ? '1000-1499' : intensity === 2 ? '1500-1999' : intensity === 3 ? '2000-2499' : '2500+'} calories`}
              />
            ))}
          </div>
          <span className="text-gray-600">More</span>
        </div>
        
        <div className="text-xs text-gray-500">
          Click on days with food logs to see details
        </div>
      </div>
    </div>
  );
};

export default NutritionHeatMap;
