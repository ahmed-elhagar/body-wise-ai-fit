
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface EnhancedDayNavigationProps {
  selectedDay: number;
  onDayChange: (day: number) => void;
  workoutType: 'home' | 'gym';
  totalDays?: number;
  completedDays?: number[];
}

const EnhancedDayNavigation = ({ 
  selectedDay, 
  onDayChange, 
  workoutType,
  totalDays = 7,
  completedDays = []
}: EnhancedDayNavigationProps) => {
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
          onClick={() => onDayChange(Math.max(1, selectedDay - 1))}
          disabled={selectedDay <= 1}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ChevronLeft className="w-4 h-4" />
          {t('navigation:previous') || 'Previous'}
        </Button>

        <div className="text-center space-y-2">
          <div className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{getDayName(selectedDay)}</h2>
          </div>
          
          <div className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="outline" className="bg-white">
              {workoutType === 'home' ? t('exercise:homeWorkout') : t('exercise:gymWorkout')}
            </Badge>
            {completedDays.includes(selectedDay) && (
              <Badge className="bg-green-100 text-green-800">
                {t('exercise:completed') || 'Completed'}
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => onDayChange(Math.min(totalDays, selectedDay + 1))}
          disabled={selectedDay >= totalDays}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {t('navigation:next') || 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default EnhancedDayNavigation;
