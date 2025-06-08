
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface EnhancedDayNavigationProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
  workoutType: "home" | "gym";
  totalDays?: number;
}

const EnhancedDayNavigation = ({
  selectedDay,
  onDaySelect,
  workoutType,
  totalDays = 7
}: EnhancedDayNavigationProps) => {
  const { t, isRTL } = useI18n();

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const handlePrevious = () => {
    if (selectedDay > 1) {
      onDaySelect(selectedDay - 1);
    }
  };

  const handleNext = () => {
    if (selectedDay < totalDays) {
      onDaySelect(selectedDay + 1);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg border ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Calendar className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">
          {t('exercise:day') || 'Day'} {selectedDay}
        </span>
        <span className="text-sm text-gray-500">
          ({workoutType === 'home' ? t('exercise:home') || 'Home' : t('exercise:gym') || 'Gym'})
        </span>
      </div>

      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={selectedDay <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex gap-1">
          {days.map((day) => (
            <Button
              key={day}
              variant={selectedDay === day ? "default" : "outline"}
              size="sm"
              onClick={() => onDaySelect(day)}
              className="w-8 h-8 p-0"
            >
              {day}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={selectedDay >= totalDays}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedDayNavigation;
