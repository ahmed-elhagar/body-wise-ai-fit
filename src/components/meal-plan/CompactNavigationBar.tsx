
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid3X3, ChevronLeft, ChevronRight } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

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
  const { mealPlanT } = useMealPlanTranslation();
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
      dayDate: format(date, 'd'),
      fullDayName: format(date, 'EEEE')
    };
  });

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-fitness-primary-100 shadow-sm">
      <div className="p-4">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-9 w-9 p-0 hover:bg-fitness-primary-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center min-w-[120px]">
              <div className="text-sm font-medium text-fitness-primary-700">
                {format(weekStartDate, 'MMM d')} - {format(addDays(weekStartDate, 6), 'MMM d')}
              </div>
              {isCurrentWeek && (
                <Badge className="bg-fitness-accent-100 text-fitness-accent-700 text-xs px-2 py-0.5 mt-1">
                  Current
                </Badge>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-9 w-9 p-0 hover:bg-fitness-primary-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Center: Days (only in daily view with more space) */}
          {viewMode === 'daily' && (
            <div className="flex gap-2 flex-1 justify-center overflow-x-auto px-4">
              {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate }) => (
                <button
                  key={dayNumber}
                  onClick={() => onDayChange(dayNumber)}
                  className={`
                    flex flex-col items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 min-w-[60px]
                    ${isSelected 
                      ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105' 
                      : 'hover:bg-fitness-primary-50 text-fitness-primary-600 hover:scale-102'
                    }
                    ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-300' : ''}
                  `}
                >
                  <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-fitness-primary-500'}`}>
                    {dayName}
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-fitness-primary-700'}`}>
                    {dayDate}
                  </span>
                  {isToday && (
                    <div className={`w-2 h-2 rounded-full mt-1 ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Right: View Mode Toggle (Icons Only) */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all ${
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
              className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all ${
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
