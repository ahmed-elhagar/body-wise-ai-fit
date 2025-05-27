
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeeklyNavigationProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  weekStartDate: Date;
}

const WeeklyNavigation = ({ currentWeekOffset, onWeekChange, weekStartDate }: WeeklyNavigationProps) => {
  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const endDay = endDate.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  const getWeekStatus = (offset: number) => {
    if (offset === 0) return "This Week";
    if (offset === -1) return "Last Week";
    if (offset === 1) return "Next Week";
    if (offset < 0) return `${Math.abs(offset)} weeks ago`;
    return `${offset} weeks ahead`;
  };

  return (
    <Card className="mb-6 p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onWeekChange(currentWeekOffset - 1)}
          className="bg-white/80"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous Week
        </Button>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {formatWeekRange(weekStartDate)}
          </h3>
          <p className="text-sm text-gray-600">{getWeekStatus(currentWeekOffset)}</p>
        </div>

        <Button
          variant="outline"
          onClick={() => onWeekChange(currentWeekOffset + 1)}
          className="bg-white/80"
        >
          Next Week
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};

export default WeeklyNavigation;
