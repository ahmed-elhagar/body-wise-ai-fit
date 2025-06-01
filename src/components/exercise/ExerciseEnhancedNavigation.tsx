import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";
import { format, addDays } from 'date-fns';

interface ExerciseEnhancedNavigationProps {
  currentWeekOffset: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  weekStartDate: Date;
}

const ExerciseEnhancedNavigation = ({
  currentWeekOffset,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  weekStartDate
}: ExerciseEnhancedNavigationProps) => {
  const { t } = useI18n();

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    const startMonth = format(startDate, 'MMM');
    const startDay = format(startDate, 'd');
    const endMonth = format(endDate, 'MMM');
    const endDay = format(endDate, 'd');
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  const year = format(weekStartDate, 'yyyy');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousWeek}
          disabled={currentWeekOffset === 0}
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-5 h-5 text-fitness-primary" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Week {currentWeekOffset + 1}
              </h3>
              <p className="text-sm text-gray-600">
                {formatWeekRange(weekStartDate)}, {year}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNextWeek}
          disabled={currentWeekOffset >= 3}
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default ExerciseEnhancedNavigation;
