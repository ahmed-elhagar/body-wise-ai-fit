
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

interface NutritionHeatMapProps {
  currentMonth: Date;
  dailyTotals: Map<string, { calories: number; protein: number; carbs: number; fat: number; count: number }>;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  isLoading: boolean;
}

const NutritionHeatMap = ({ 
  currentMonth, 
  dailyTotals, 
  selectedDate, 
  onDateSelect, 
  isLoading 
}: NutritionHeatMapProps) => {
  
  // Get all days in the calendar view (including days from prev/next month to complete weeks)
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getIntensityClass = (calories: number) => {
    if (calories === 0) return 'bg-gray-100 hover:bg-gray-200';
    if (calories < 500) return 'bg-green-100 hover:bg-green-200';
    if (calories < 1200) return 'bg-green-200 hover:bg-green-300';
    if (calories < 2000) return 'bg-green-400 hover:bg-green-500';
    return 'bg-green-600 hover:bg-green-700';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Less</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
        </div>
        <span>More</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayData = dailyTotals.get(dateKey);
          const calories = dayData?.calories || 0;
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={dateKey}
              onClick={() => onDateSelect(day)}
              className={cn(
                "w-8 h-8 rounded-sm text-xs font-medium transition-all duration-200",
                getIntensityClass(calories),
                isSelected && "ring-2 ring-green-600 ring-offset-1",
                isToday && "ring-2 ring-blue-500 ring-offset-1",
                !isCurrentMonth && "opacity-30",
                "focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1"
              )}
              title={`${format(day, 'MMM d')}: ${Math.round(calories)} calories${dayData ? ` (${dayData.count} meals)` : ''}`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600 text-center">
        <span>
          {Array.from(dailyTotals.values()).filter(d => d.calories > 0).length} days with logged food this month
        </span>
      </div>
    </div>
  );
};

export default NutritionHeatMap;
