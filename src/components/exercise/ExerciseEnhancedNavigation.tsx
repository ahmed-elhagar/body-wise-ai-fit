
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ExerciseEnhancedNavigationProps {
  currentDay: number;
  onDayChange: (day: number) => void;
  totalDays?: number;
  completedDays?: number[];
}

const ExerciseEnhancedNavigation = ({ 
  currentDay, 
  onDayChange, 
  totalDays = 7,
  completedDays = []
}: ExerciseEnhancedNavigationProps) => {
  const { t, isRTL } = useI18n();

  const getDayName = (dayNumber: number) => {
    const days = [
      t('common:monday') || 'Monday',
      t('common:tuesday') || 'Tuesday', 
      t('common:wednesday') || 'Wednesday',
      t('common:thursday') || 'Thursday',
      t('common:friday') || 'Friday',
      t('common:saturday') || 'Saturday',
      t('common:sunday') || 'Sunday'
    ];
    return days[dayNumber - 1] || `${t('exercise:day')} ${dayNumber}`;
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          onClick={() => onDayChange(Math.max(1, currentDay - 1))}
          disabled={currentDay <= 1}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ChevronLeft className="w-4 h-4" />
          {t('navigation:previous') || 'Previous'}
        </Button>

        <div className="text-center space-y-2">
          <div className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{getDayName(currentDay)}</h2>
          </div>
          
          <div className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="outline" className="bg-white">
              {t('exercise:day')} {currentDay} {t('common:of')} {totalDays}
            </Badge>
            {completedDays.includes(currentDay) && (
              <Badge className="bg-green-100 text-green-800">
                {t('exercise:completed') || 'Completed'}
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => onDayChange(Math.min(totalDays, currentDay + 1))}
          disabled={currentDay >= totalDays}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('navigation:next') || 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ExerciseEnhancedNavigation;
