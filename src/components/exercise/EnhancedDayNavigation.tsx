
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useI18n } from '@/hooks/useI18n';

interface EnhancedDayNavigationProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
  currentWeek: number;
  onWeekChange: (direction: 'prev' | 'next') => void;
}

const EnhancedDayNavigation = ({
  selectedDay,
  onDaySelect,
  currentWeek,
  onWeekChange
}: EnhancedDayNavigationProps) => {
  const { t } = useI18n();

  // Calculate the current week's start date
  const today = new Date();
  const weekStart = addDays(startOfWeek(today, { weekStartsOn: 6 }), (currentWeek - 1) * 7);

  const days = [
    { number: 6, name: 'Sat' },
    { number: 7, name: 'Sun' },
    { number: 1, name: 'Mon' },
    { number: 2, name: 'Tue' },
    { number: 3, name: 'Wed' },
    { number: 4, name: 'Thu' },
    { number: 5, name: 'Fri' }
  ];

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStart, dayOffset);
  };

  const isToday = (dayNumber: number) => {
    const dayDate = getDateForDay(dayNumber);
    return format(dayDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg">
      <div className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange('prev')}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('exercise:prevWeek')}
          </Button>
          
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <Calendar className="w-4 h-4" />
            <span>{t('exercise:week')} {currentWeek}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange('next')}
            className="flex items-center gap-2"
          >
            {t('exercise:nextWeek')}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Day Selector */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayDate = getDateForDay(day.number);
            const isSelected = selectedDay === day.number;
            const isDayToday = isToday(day.number);
            
            return (
              <Button
                key={day.number}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onDaySelect(day.number)}
                className={`flex flex-col h-16 text-center transition-all duration-200 ${
                  isDayToday 
                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                    : ''
                } ${
                  isSelected 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white scale-105 shadow-lg' 
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                <span className="text-xs font-medium mb-1">
                  {t(`common:${day.name.toLowerCase()}`)}
                </span>
                <span className="text-lg font-bold">
                  {format(dayDate, 'd')}
                </span>
                {isDayToday && (
                  <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Week Range Display */}
        <div className="text-center text-sm text-gray-600">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </div>
      </div>
    </Card>
  );
};

export default EnhancedDayNavigation;
