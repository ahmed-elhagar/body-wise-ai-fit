
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface WeeklyExerciseNavigationProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
  totalWeeks?: number;
}

export const WeeklyExerciseNavigation = ({
  currentWeek,
  onWeekChange,
  totalWeeks = 12
}: WeeklyExerciseNavigationProps) => {
  const { t, isRTL } = useI18n();

  return (
    <Card className="p-4">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(currentWeek - 1)}
          disabled={currentWeek <= 1}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {t('exercise:previousWeek') || 'Previous Week'}
        </Button>

        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">
            {t('exercise:week') || 'Week'} {currentWeek} {t('exercise:of') || 'of'} {totalWeeks}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(currentWeek + 1)}
          disabled={currentWeek >= totalWeeks}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('exercise:nextWeek') || 'Next Week'}
          {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default WeeklyExerciseNavigation;
