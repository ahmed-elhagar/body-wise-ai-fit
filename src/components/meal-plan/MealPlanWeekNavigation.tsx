
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from "lucide-react";
import { format, addDays } from "date-fns";

interface MealPlanWeekNavigationProps {
  currentWeekOffset: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onCurrentWeek: () => void;
  weekStartDate: Date;
}

const MealPlanWeekNavigation = ({
  currentWeekOffset,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek,
  weekStartDate
}: MealPlanWeekNavigationProps) => {
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
          disabled={currentWeekOffset >= 4}
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-5 h-5 text-fitness-primary" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Week {Math.abs(currentWeekOffset) + 1}
              </h3>
              <p className="text-sm text-gray-600">
                {formatWeekRange(weekStartDate)}, {year}
              </p>
            </div>
          </div>
          
          {currentWeekOffset === 0 ? (
            <Badge variant="secondary" className="mt-2">
              Current Week
            </Badge>
          ) : (
            <Badge variant="outline" className="mt-2">
              Week {Math.abs(currentWeekOffset) + 1}
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNextWeek}
          disabled={currentWeekOffset <= -4}
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {currentWeekOffset !== 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onCurrentWeek}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              Back to Current Week
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MealPlanWeekNavigation;
