
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Building2, Coffee, Target } from "lucide-react";
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
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const CombinedWeeklyDayNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
  workoutType,
  onWorkoutTypeChange,
}: CombinedWeeklyDayNavigationProps) => {
  const isMobile = useIsMobile();

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'd MMM')} - ${format(endDate, 'd MMM')}`;
  };

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
        className={`h-14 flex-shrink-0 flex flex-col items-center justify-center space-y-1 rounded-lg transition-all duration-200 w-14 ${
          isSelected 
            ? restDay ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white' 
            : restDay ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'text-blue-800 bg-gray-50 hover:bg-blue-100'
        }`}
        onClick={() => setSelectedDayNumber(dayNumber)}
      >
        <span className="text-xs font-medium">{dayName}</span>
        <div className="h-4 w-4 flex items-center justify-center">
          {restDay ? <Coffee className="w-4 h-4" /> : <Target className="w-4 h-4" />}
        </div>
      </Button>
    );
  }

  const WorkoutTypeToggle = () => (
    <div className="flex items-center p-1 bg-gray-100 rounded-lg">
      <Button
        variant={workoutType === 'home' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onWorkoutTypeChange('home')}
        className={`flex-1 h-8 rounded-md ${workoutType === 'home' ? 'bg-blue-600 text-white shadow' : 'text-gray-700'}`}
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Button>
      <Button
        variant={workoutType === 'gym' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onWorkoutTypeChange('gym')}
        className={`flex-1 h-8 rounded-md ${workoutType === 'gym' ? 'bg-purple-600 text-white shadow' : 'text-gray-700'}`}
      >
        <Building2 className="w-4 h-4 mr-1" />
        Gym
      </Button>
    </div>
  );

  return (
    <Card className="p-2 bg-white shadow-md rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        {/* Week Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0}
            className="rounded-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-center w-28">
            <h3 className="text-sm font-semibold text-gray-800">
                Week {currentWeekOffset + 1}
            </h3>
            <p className="text-xs text-gray-500">
                {formatWeekRange(weekStartDate)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3}
            className="rounded-md"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Day Selector */}
        <div className="flex-1">
          {isMobile ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max space-x-1 p-1 bg-gray-100 rounded-lg">
                {dayNames.map((day, index) => dayButton(index + 1, day))}
              </div>
              <ScrollBar orientation="horizontal" className="h-1.5 mt-1" />
            </ScrollArea>
          ) : (
            <div className="p-1 bg-gray-100 rounded-lg">
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((day, index) => dayButton(index + 1, day))}
              </div>
            </div>
          )}
        </div>
        
        {/* Workout Type Toggle */}
        <div className="hidden sm:block">
          <WorkoutTypeToggle />
        </div>
      </div>
      { isMobile && (
        <div className="mt-2 sm:hidden">
          <WorkoutTypeToggle />
        </div>
      )}
    </Card>
  );
};
