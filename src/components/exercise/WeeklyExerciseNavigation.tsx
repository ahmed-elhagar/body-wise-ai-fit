
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";

interface WeeklyExerciseNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
}

export const WeeklyExerciseNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate
}: WeeklyExerciseNavigationProps) => {
  const weekEndDate = addDays(weekStartDate, 6);
  
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-fitness-primary" />
          <div>
            <h3 className="font-semibold text-gray-800">
              Week {currentWeekOffset + 1}
            </h3>
            <p className="text-sm text-gray-600">
              {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0}
            className="bg-white/80"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3} // 4-week program
            className="bg-white/80"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
