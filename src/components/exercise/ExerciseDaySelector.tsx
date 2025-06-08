
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseDaySelectorProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
  weekStartDate?: Date;
}

const ExerciseDaySelector = ({
  selectedDay,
  onDaySelect,
  weekStartDate = new Date()
}: ExerciseDaySelectorProps) => {
  const { t, isRTL } = useI18n();

  const days = [
    { number: 1, name: 'Mon' },
    { number: 2, name: 'Tue' },
    { number: 3, name: 'Wed' },
    { number: 4, name: 'Thu' },
    { number: 5, name: 'Fri' },
    { number: 6, name: 'Sat' },
    { number: 7, name: 'Sun' }
  ];

  const getDateForDay = (dayNumber: number) => {
    return addDays(weekStartDate, dayNumber - 1);
  };

  return (
    <Card className="p-4">
      <div className={`flex gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        {days.map((day) => {
          const dayDate = getDateForDay(day.number);
          const isSelected = selectedDay === day.number;
          const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <Button
              key={day.number}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onDaySelect(day.number)}
              className={`flex flex-col h-16 min-w-16 ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <span className="text-xs font-medium">{day.name}</span>
              <span className="text-lg font-bold">{format(dayDate, 'd')}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default ExerciseDaySelector;
