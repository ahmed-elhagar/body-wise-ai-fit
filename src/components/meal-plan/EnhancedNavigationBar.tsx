
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface EnhancedNavigationBarProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
}

const EnhancedNavigationBar = ({
  weekStartDate,
  selectedDayNumber,
  onDayChange,
  viewMode,
  onViewModeChange,
  currentWeekOffset,
  onWeekChange
}: EnhancedNavigationBarProps) => {
  const { mealPlanT } = useMealPlanTranslation();
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const date = addDays(weekStartDate, index);
    const isSelected = selectedDayNumber === dayNumber;
    const isToday = isSameDay(date, today);
    
    return {
      dayNumber,
      date,
      isSelected,
      isToday,
      dayName: format(date, 'EEE'),
      dayDate: format(date, 'd'),
      fullDayName: format(date, 'EEEE')
    };
  });

  const isCurrentWeek = currentWeekOffset === 0;
  const weekEndDate = addDays(weekStartDate, 6);

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-50 via-white to-fitness-accent-50 border-fitness-primary-200 shadow-lg">
      <div className="p-4">
        {/* Top Row: Week Navigation + View Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-8 w-8 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-fitness-primary-700">
                  {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d')}
                </h2>
                {isCurrentWeek && (
                  <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 text-xs px-2 py-0.5">
                    Current
                  </Badge>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-8 w-8 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg p-1 border border-fitness-primary-200 shadow-sm">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-xs ${
                viewMode === 'daily'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {mealPlanT('dailyView')}
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-xs ${
                viewMode === 'weekly'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              {mealPlanT('weeklyView')}
            </button>
          </div>
        </div>

        {/* Bottom Row: Day Selector (only show in daily view) */}
        {viewMode === 'daily' && (
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  min-w-0 flex-shrink-0 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-center relative
                  ${isSelected 
                    ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 shadow-sm border border-fitness-primary-100'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-300' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-fitness-primary-500'}`}>
                    {dayName}
                  </span>
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-fitness-primary-700'}`}>
                    {dayDate}
                  </span>
                  {isToday && (
                    <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedNavigationBar;
