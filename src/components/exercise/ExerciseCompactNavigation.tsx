
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseCompactNavigationProps {
  currentDay: number;
  onDayChange: (day: number) => void;
  totalDays?: number;
}

const ExerciseCompactNavigation = ({ 
  currentDay, 
  onDayChange, 
  totalDays = 7 
}: ExerciseCompactNavigationProps) => {
  const { t, isRTL } = useI18n();

  const handlePrevious = () => {
    if (currentDay > 1) {
      onDayChange(currentDay - 1);
    }
  };

  const handleNext = () => {
    if (currentDay < totalDays) {
      onDayChange(currentDay + 1);
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber - 1] || `Day ${dayNumber}`;
  };

  return (
    <div className={`flex items-center justify-between bg-white rounded-lg p-4 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentDay <= 1}
        className={isRTL ? 'rotate-180' : ''}
      >
        <ChevronLeft className="w-4 h-4" />
        {t('navigation:previous') || 'Previous'}
      </Button>

      <div className="text-center">
        <h3 className="font-semibold text-lg">{getDayName(currentDay)}</h3>
        <p className="text-sm text-gray-600">{t('exercise:day')} {currentDay}</p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentDay >= totalDays}
        className={isRTL ? 'rotate-180' : ''}
      >
        {t('navigation:next') || 'Next'}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ExerciseCompactNavigation;
