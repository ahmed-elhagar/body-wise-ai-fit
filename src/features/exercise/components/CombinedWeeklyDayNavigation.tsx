import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, RotateCcw, Target, Coffee } from "lucide-react";
import { format, addDays } from "date-fns";
import { ExerciseProgram } from "@/features/exercise";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CombinedWeeklyDayNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: ExerciseProgram | null;
}

export const CombinedWeeklyDayNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
}: CombinedWeeklyDayNavigationProps) => {
  const isMobile = useIsMobile();

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    const startMonth = format(startDate, 'MMM');
    const startDay = format(startDate, 'd');
    const endMonth = format(endDate, 'MMM');
    const endDay = format(endDate, 'd');
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${format(startDate, 'yyyy')}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${format(startDate, 'yyyy')}`;
    }
  };

  const goToCurrentWeek = () => setCurrentWeekOffset(0);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDayWorkout = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return null;
    return currentProgram.daily_workouts.find((workout: any) => workout.day_number === dayNumber);
  };

  const isRestDay = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    return workout?.is_rest_day || false;
  };

  const dayButton = (dayNumber: number, dayName: string) => {
    const isSelected = selectedDayNumber === dayNumber;
    const restDay = isRestDay(dayNumber);

    return (
      <Button
        key={dayName}
        variant={isSelected ? "default" : "ghost"}
        className={`h-16 flex-shrink-0 flex flex-col items-center justify-center space-y-1.5 rounded-xl transition-all duration-200 ${
          isMobile ? 'w-16' : ''
        } ${
          isSelected 
            ? restDay ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
            : restDay ? 'text-orange-600 hover:bg-orange-100' : 'text-gray-600 hover:bg-white'
        }`}
        onClick={() => setSelectedDayNumber(dayNumber)}
      >
        <span className="text-sm font-medium">{dayName}</span>
        <div className="h-4 w-4 flex items-center justify-center">
          {restDay ? (
            <Coffee className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
          ) : (
            isSelected 
              ? <div className="w-1.5 h-1.5 bg-white rounded-full" />
              : <Target className="w-4 h-4 text-blue-500" />
          )}
        </div>
      </Button>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
          disabled={currentWeekOffset === 0}
          className="rounded-full h-10 w-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">
                    Week {currentWeekOffset + 1}
                </h3>
                <p className="text-sm text-gray-500">
                    {formatWeekRange(weekStartDate)}
                </p>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
          disabled={currentWeekOffset >= 3}
          className="rounded-full h-10 w-10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Week Status & Actions */}
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-100">
        {currentWeekOffset === 0 ? (
          <Badge className="inline-flex items-center bg-green-100 text-green-800 border-green-200 px-4 py-1.5 text-sm font-semibold">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Current Week
          </Badge>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToCurrentWeek}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Back to Current Week
          </Button>
        )}
      </div>

      {/* Day Selector */}
      <div className="mt-4">
        {isMobile ? (
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 p-2 bg-gray-50/70 rounded-2xl">
              {dayNames.map((day, index) => dayButton(index + 1, day))}
            </div>
            <ScrollBar orientation="horizontal" className="h-2 mt-2" />
          </ScrollArea>
        ) : (
          <div className="p-2 bg-gray-50/70 rounded-2xl">
            <div className="grid grid-cols-7 gap-1">
              {dayNames.map((day, index) => dayButton(index + 1, day))}
            </div>
          </div>
        )}
      </div>

    </Card>
  );
};
