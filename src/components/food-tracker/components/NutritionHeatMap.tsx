
import { useMemo } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";

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
  const heatMapData = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayData = data.filter(entry => 
        format(new Date(entry.consumed_at), 'yyyy-MM-dd') === dayStr
      );

      const totalCalories = dayData.reduce((sum, entry) => sum + (entry.calories_consumed || 0), 0);
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
        totalCalories,
        totalEntries,
        intensity
      };
    });
  }, [data, currentMonth]);

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-gray-100';
      case 1: return 'bg-green-100';
      case 2: return 'bg-green-200';
      case 3: return 'bg-green-300';
      case 4: return 'bg-green-400';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {heatMapData.map((day) => (
          <div
            key={day.dateStr}
            className={`
              aspect-square rounded-md flex items-center justify-center text-xs font-medium
              ${getIntensityColor(day.intensity)}
              ${day.totalEntries > 0 ? 'text-gray-800 cursor-pointer hover:ring-2 hover:ring-green-300' : 'text-gray-500'}
              transition-all duration-200
            `}
            title={`${day.dateStr}: ${day.totalCalories} calories, ${day.totalEntries} entries`}
          >
            {day.dayNumber}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-gray-600">Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(intensity => (
            <div
              key={intensity}
              className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
            />
          ))}
        </div>
        <span className="text-gray-600">More</span>
      </div>
    </div>
  );
};

export default NutritionHeatMap;
