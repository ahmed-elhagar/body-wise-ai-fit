import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from "lucide-react";
import { format, addDays } from "date-fns";

interface CompactNavigationProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  onDaySelect: (day: number) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

const CompactNavigation = ({
  currentWeekOffset,
  onWeekChange,
  weekStartDate,
  selectedDayNumber,
  onDaySelect,
  viewMode,
  onViewModeChange
}: CompactNavigationProps) => {
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

  const handleViewModeChange = (mode: 'daily' | 'weekly') => {
    onViewModeChange(mode);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onWeekChange(currentWeekOffset + 1)}
          disabled={currentWeekOffset >= 4}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-fitness-primary" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Week {Math.abs(currentWeekOffset) + 1}
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
          onClick={() => onWeekChange(currentWeekOffset - 1)}
          disabled={currentWeekOffset <= -4}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant={viewMode === 'daily' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('daily')}
          className="flex-1 mr-2"
        >
          Daily
        </Button>
        <Button
          variant={viewMode === 'weekly' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('weekly')}
          className="flex-1"
        >
          Weekly
        </Button>
      </div>
    </Card>
  );
};

export default CompactNavigation;
