
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays } from "date-fns";

interface MealPlanWeekNavigationCompactProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
}

const MealPlanWeekNavigationCompact = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber
}: MealPlanWeekNavigationCompactProps) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Week of {format(weekStartDate, 'MMM d, yyyy')}
            </h2>
          </div>
          
          <div className="flex gap-1">
            <Button
              onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setCurrentWeekOffset(0)}
              variant={currentWeekOffset === 0 ? "default" : "outline"}
              size="sm"
              className="px-3"
            >
              Current
            </Button>
            <Button
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              variant="outline"
              size="sm"
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Compact Day Selector */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dayNumber = i + 1;
            const dayDate = addDays(weekStartDate, i);
            const isSelected = selectedDayNumber === dayNumber;
            const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <Button
                key={dayNumber}
                onClick={() => setSelectedDayNumber(dayNumber)}
                variant={isSelected ? "default" : "outline"}
                className={`p-2 h-auto flex flex-col items-center gap-1 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'bg-white hover:bg-gray-50'
                } ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                size="sm"
              >
                <span className="text-xs font-medium opacity-75">
                  {format(dayDate, 'EEE')}
                </span>
                <span className="text-sm font-bold">
                  {format(dayDate, 'd')}
                </span>
                {isToday && (
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanWeekNavigationCompact;
