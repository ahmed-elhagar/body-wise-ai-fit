
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react";
import { useMealPlanTranslations } from "@/utils/mealPlanTranslations";

interface UnifiedNavigationProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  showDaySelector?: boolean;
}

const UnifiedNavigation = ({
  viewMode,
  onViewModeChange,
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  selectedDayNumber,
  onDayChange,
  showDaySelector = true
}: UnifiedNavigationProps) => {
  const { currentWeek, dailyView, weeklyView, isRTL } = useMealPlanTranslations();
  
  const isCurrentWeek = currentWeekOffset === 0;
  const weekEndDate = addDays(weekStartDate, 6);
  const todayDate = new Date();

  const formatWeekRange = (startDate: Date, endDate: Date) => {
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'd')}`;
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
  };

  const days = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const date = addDays(weekStartDate, index);
    const isSelected = selectedDayNumber === dayNumber;
    const isToday = format(date, 'yyyy-MM-dd') === format(todayDate, 'yyyy-MM-dd');
    
    return {
      dayNumber,
      date,
      isSelected,
      isToday,
      dayDate: format(date, 'd'),
      dayName: format(date, 'EEE')
    };
  });

  return (
    <Card className="bg-white border-fitness-primary-100 shadow-sm rounded-xl">
      <div className="p-4">
        {/* Top Row: Week Navigation & View Mode Toggle */}
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Week Navigation */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-8 w-8 p-0 border-fitness-primary-200 text-fitness-primary-600 hover:bg-fitness-primary-50 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center min-w-0">
              <h3 className="text-sm font-semibold text-fitness-primary-800 truncate">
                {formatWeekRange(weekStartDate, weekEndDate)}
              </h3>
              {isCurrentWeek && (
                <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 text-xs mt-1">
                  {currentWeek || 'Current'}
                </Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-8 w-8 p-0 border-fitness-primary-200 text-fitness-primary-600 hover:bg-fitness-primary-50 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-fitness-primary-50 rounded-lg p-1 border border-fitness-primary-200">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-xs ${
                viewMode === 'daily'
                  ? 'bg-white text-fitness-primary-700 shadow-sm border border-fitness-primary-200'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{dailyView || 'Daily'}</span>
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-xs ${
                viewMode === 'weekly'
                  ? 'bg-white text-fitness-primary-700 shadow-sm border border-fitness-primary-200'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-100'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>{weeklyView || 'Weekly'}</span>
            </button>
          </div>
        </div>

        {/* Day Selector - Only show in daily view */}
        {viewMode === 'daily' && showDaySelector && (
          <div className="grid grid-cols-7 gap-1">
            {days.map(({ dayNumber, date, isSelected, isToday, dayDate, dayName }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  relative p-2 rounded-lg font-medium transition-all duration-200 text-center text-xs
                  ${isSelected 
                    ? 'bg-fitness-primary-500 text-white shadow-md scale-105' 
                    : 'bg-fitness-primary-50 text-fitness-primary-700 hover:bg-fitness-primary-100 hover:scale-102'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-400 bg-fitness-accent-50' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs opacity-75 uppercase tracking-wide">
                    {dayName}
                  </span>
                  <span className="text-sm font-bold">
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

export default UnifiedNavigation;
