
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface EnhancedDayNavigationProps {
  selectedDay?: number;
  totalDays?: number;
  workoutType?: "home" | "gym";
  onDayChange?: (day: number) => void;
}

const EnhancedDayNavigation = ({ 
  selectedDay = 1, 
  totalDays = 7, 
  workoutType = "home",
  onDayChange 
}: EnhancedDayNavigationProps) => {
  const { t, isRTL } = useI18n();

  const handlePrevious = () => {
    if (selectedDay > 1) {
      onDayChange?.(selectedDay - 1);
    }
  };

  const handleNext = () => {
    if (selectedDay < totalDays) {
      onDayChange?.(selectedDay + 1);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={selectedDay <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">
              {t('exercise:day') || 'Day'} {selectedDay} {t('common:of') || 'of'} {totalDays}
            </span>
            <span className="text-sm text-gray-500">
              ({workoutType === 'home' ? t('exercise:homeWorkout') || 'Home' : t('exercise:gymWorkout') || 'Gym'})
            </span>
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
      </CardContent>
    </Card>
  );
};

export default EnhancedDayNavigation;
