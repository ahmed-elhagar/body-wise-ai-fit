
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { format, addDays, startOfWeek } from 'date-fns';

interface EnhancedDayNavigationProps {
  selectedDay: number;
  onDayChange: (day: number) => void;
  workoutType: 'home' | 'gym';
  weekOffset?: number;
}

const EnhancedDayNavigation = ({
  selectedDay,
  onDayChange,
  workoutType,
  weekOffset = 0
}: EnhancedDayNavigationProps) => {
  const { t, isRTL } = useI18n();

  const weekStart = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * 7);
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    const dayNumber = i + 1;
    const isSelected = selectedDay === dayNumber;
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    
    return {
      number: dayNumber,
      name: format(date, 'EEE'),
      date: format(date, 'MMM d'),
      fullDate: date,
      isSelected,
      isToday
    };
  });

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="space-y-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">
              {t('exercise:weeklySchedule') || 'Weekly Schedule'}
            </h3>
            <Badge variant="outline" className="bg-white/80">
              {workoutType === 'home' ? t('exercise:home') : t('exercise:gym')}
            </Badge>
          </div>
        </div>

        <div className={`flex gap-2 overflow-x-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
          {days.map((day) => (
            <Button
              key={day.number}
              variant={day.isSelected ? "default" : "outline"}
              onClick={() => onDayChange(day.number)}
              className={`flex flex-col h-16 min-w-16 px-3 ${
                day.isToday ? 'ring-2 ring-blue-500' : ''
              } ${
                day.isSelected 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="text-xs font-medium">{day.name}</span>
              <span className="text-lg font-bold">{format(day.fullDate, 'd')}</span>
              {day.isToday && (
                <div className="w-1 h-1 bg-orange-400 rounded-full mt-1"></div>
              )}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default EnhancedDayNavigation;
