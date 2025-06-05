
import { useMemo } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isValid } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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

const NutritionHeatMap = ({ data, currentMonth }: NutritionHeatMapProps) => {
  const { heatMapData, hasErrors } = useMemo(() => {
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
        
        const totalEntries = dayData.length;

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
          totalEntries,
          intensity
        };
      });

      return {
        heatMapData: processedData,
        hasErrors: errorCount > 0
      };
    } catch (error) {
      console.error('Error processing heat map data:', error);
      return {
        heatMapData: [],
        hasErrors: true
      };
    }
  }, [data, currentMonth]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-gray-100 hover:bg-gray-200';
      case 1: return 'bg-green-100 hover:bg-green-200';
      case 2: return 'bg-green-200 hover:bg-green-300';
      case 3: return 'bg-green-300 hover:bg-green-400';
      case 4: return 'bg-green-400 hover:bg-green-500';
      default: return 'bg-gray-100 hover:bg-gray-200';
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
        {/* Continue with rendering despite errors */}
      </div>
    );
  }

  if (heatMapData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load calendar data for this month.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {heatMapData.map((day) => (
          <div
            key={day.dateStr}
            className={`
              aspect-square rounded-md flex items-center justify-center text-xs font-medium
              ${getIntensityColor(day.intensity)}
              ${day.totalEntries > 0 ? 'text-gray-800 cursor-pointer ring-1 ring-gray-300 hover:ring-2 hover:ring-green-400' : 'text-gray-500'}
              transition-all duration-200 transform hover:scale-105
            `}
            title={`${day.dateStr}: ${day.totalCalories} calories, ${day.totalEntries} entries`}
          >
            {day.dayNumber}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-600">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(intensity => (
              <div
                key={intensity}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity).split(' ')[0]}`}
                title={`${intensity === 0 ? '0' : intensity === 1 ? '1000-1499' : intensity === 2 ? '1500-1999' : intensity === 3 ? '2000-2499' : '2500+'} calories`}
              />
            ))}
          </div>
          <span className="text-gray-600">More</span>
        </div>
        
        <div className="text-xs text-gray-500">
          Total logged days: {heatMapData.filter(day => day.totalEntries > 0).length}
        </div>
      </div>
    </div>
  );
};

export default NutritionHeatMap;
