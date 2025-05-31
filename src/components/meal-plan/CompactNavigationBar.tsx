
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react";

interface CompactNavigationBarProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
}

const CompactNavigationBar = ({
  weekStartDate,
  selectedDayNumber,
  onDayChange,
  viewMode,
  onViewModeChange,
  currentWeekOffset,
  onWeekChange
}: CompactNavigationBarProps) => {
  const today = new Date();
  const isCurrentWeek = currentWeekOffset === 0;

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
      dayDate: format(date, 'd')
    };
  });

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-fitness-primary-100 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Week Navigation - More Compact */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-8 w-8 p-0 hover:bg-fitness-primary-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center min-w-[100px]">
              <div className="text-sm font-medium text-fitness-primary-700">
                {format(weekStartDate, 'MMM d')} - {format(addDays(weekStartDate, 6), 'd')}
              </div>
              {isCurrentWeek && (
                <Badge className="bg-fitness-accent-100 text-fitness-accent-700 text-xs px-2 py-0.5">
                  Current
                </Badge>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-8 w-8 p-0 hover:bg-fitness-primary-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Days - Better spacing and clarity */}
          {viewMode === 'daily' && (
            <div className="flex gap-1 flex-1 justify-center max-w-lg">
              {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate }) => (
                <button
                  key={dayNumber}
                  onClick={() => onDayChange(dayNumber)}
                  className={`
                    flex flex-col items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 min-w-[52px]
                    ${isSelected 
                      ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md' 
                      : 'hover:bg-fitness-primary-50 text-fitness-primary-600'
                    }
                    ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-300' : ''}
                  `}
                >
                  <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-fitness-primary-500'}`}>
                    {dayName}
                  </span>
                  <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-fitness-primary-700'}`}>
                    {dayDate}
                  </span>
                  {isToday && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* View Mode Toggle - Icons Only */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                viewMode === 'daily'
                  ? 'bg-white text-fitness-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Daily View"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white text-fitness-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Weekly View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompactNavigationBar;
