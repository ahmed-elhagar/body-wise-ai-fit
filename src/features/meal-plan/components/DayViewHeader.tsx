
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DayViewHeaderProps {
  selectedDay: number;
  weekStartDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

export const DayViewHeader = ({
  selectedDay,
  weekStartDate,
  onPreviousDay,
  onNextDay
}: DayViewHeaderProps) => {
  const { t } = useLanguage();
  
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousDay}
            className="h-10 w-10 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {t(dayNames[selectedDay - 1])}
            </h2>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onNextDay}
            className="h-10 w-10 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
