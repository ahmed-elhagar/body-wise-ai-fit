
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatWeekRange, getDayName } from "@/utils/mealPlanUtils";

interface MealPlanNavigationProps {
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
}

export const MealPlanNavigation = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  selectedDayNumber,
  onDayChange
}: MealPlanNavigationProps) => {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(currentWeekOffset - 1)}
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {formatWeekRange(weekStartDate)}
          </h3>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(currentWeekOffset + 1)}
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Day Navigation */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((dayNumber) => (
          <Button
            key={dayNumber}
            variant={selectedDayNumber === dayNumber ? "default" : "outline"}
            className={`text-sm py-3 ${
              selectedDayNumber === dayNumber 
                ? 'bg-fitness-gradient text-white shadow-lg' 
                : 'bg-white/80 hover:bg-gray-50'
            }`}
            onClick={() => onDayChange(dayNumber)}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">{getDayName(dayNumber).slice(0, 3)}</span>
              <span className="text-xs opacity-75 hidden sm:block">
                {getDayName(dayNumber)}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};
