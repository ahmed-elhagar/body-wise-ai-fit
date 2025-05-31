
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Grid3X3 } from "lucide-react";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface NavigationSectionProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

const NavigationSection = ({
  weekStartDate,
  selectedDayNumber,
  onDayChange,
  viewMode,
  onViewModeChange
}: NavigationSectionProps) => {
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

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-fitness-primary-200 shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-fitness-primary-700">
            {mealPlanT('dailyOverview')}
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-lg p-1 border border-fitness-primary-200 shadow-sm">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-sm ${
                viewMode === 'daily'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {mealPlanT('dailyView')}
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all text-sm ${
                viewMode === 'weekly'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              {mealPlanT('weeklyView')}
            </button>
          </div>
        </div>

        {/* Day Selector (only show in daily view) */}
        {viewMode === 'daily' && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  min-w-0 flex-shrink-0 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-center
                  ${isSelected 
                    ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105' 
                    : 'bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 shadow-sm border border-fitness-primary-100'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-300' : ''}
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-fitness-primary-500'}`}>
                    {dayName}
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-fitness-primary-700'}`}>
                    {dayDate}
                  </span>
                  {isToday && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
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

export default NavigationSection;
