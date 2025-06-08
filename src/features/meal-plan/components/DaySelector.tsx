
import React from 'react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/hooks/useI18n';

interface DaySelectorProps {
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  weekStartDate: Date;
}

export const DaySelector = ({ selectedDayNumber, onDayChange, weekStartDate }: DaySelectorProps) => {
  const { t, isRTL } = useI18n();

  const getDayName = (dayNumber: number) => {
    const dayNames = [
      t('saturday') || 'Saturday',
      t('sunday') || 'Sunday', 
      t('monday') || 'Monday',
      t('tuesday') || 'Tuesday',
      t('wednesday') || 'Wednesday',
      t('thursday') || 'Thursday',
      t('friday') || 'Friday'
    ];
    return dayNames[dayNumber - 1] || 'Day ' + dayNumber;
  };

  const getDayDate = (dayNumber: number) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date.toLocaleDateString();
  };

  return (
    <div className={`grid grid-cols-7 gap-2 ${isRTL ? 'direction-rtl' : ''}`}>
      {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
        const isSelected = selectedDayNumber === dayNumber;
        const isToday = new Date().toDateString() === new Date(weekStartDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000).toDateString();
        
        return (
          <Button
            key={dayNumber}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onDayChange(dayNumber)}
            className={`flex flex-col items-center h-16 relative p-2 ${
              isSelected ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' : 'hover:bg-blue-50 border-gray-200'
            }`}
          >
            <span className="font-semibold text-sm">
              {getDayName(dayNumber).slice(0, 3)}
            </span>
            <span className="text-xs opacity-75 mt-1">
              {getDayDate(dayNumber).split('/')[1]}/{getDayDate(dayNumber).split('/')[2]}
            </span>
            {isToday && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
            )}
          </Button>
        );
      })}
    </div>
  );
};
