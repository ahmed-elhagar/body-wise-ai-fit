
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExerciseProgramWeekNavigationProps {
  currentWeekOffset: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  weekStartDate: Date;
}

const ExerciseProgramWeekNavigation = ({
  currentWeekOffset,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  weekStartDate
}: ExerciseProgramWeekNavigationProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <Button onClick={onPreviousWeek} variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
            Previous Week
          </Button>
          
          <div className="text-center">
            <p className="font-medium">Week {currentWeekOffset + 1}</p>
            <p className="text-sm text-gray-600">
              {weekStartDate.toLocaleDateString()}
            </p>
          </div>
          
          <Button onClick={onNextWeek} variant="outline" size="sm">
            Next Week
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        {currentWeekOffset !== 0 && (
          <Button onClick={onCurrentWeek} variant="ghost" size="sm" className="w-full mt-2">
            Go to Current Week
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseProgramWeekNavigation;
