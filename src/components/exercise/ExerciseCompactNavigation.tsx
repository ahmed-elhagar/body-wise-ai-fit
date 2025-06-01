import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ExerciseCompactNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
}

export const ExerciseCompactNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
  workoutType
}: ExerciseCompactNavigationProps) => {
  const { t } = useI18n();
  const shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Define rest days based on workout type
  const getRestDays = (type: "home" | "gym") => {
    return type === "home" ? [3, 6, 7] : [4, 7]; // Wed, Sat, Sun for home; Thu, Sun for gym
  };

  const restDays = getRestDays(workoutType);

  // Check if day has workout data
  const hasWorkoutData = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return false;
    return currentProgram.daily_workouts.some((workout: any) => 
      workout.day_number === dayNumber && !workout.is_rest_day
    );
  };

  const isRestDay = (dayNumber: number) => {
    return restDays.includes(dayNumber);
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    const startMonth = format(startDate, 'MMM');
    const startDay = format(startDate, 'd');
    const endMonth = format(endDate, 'MMM');
    const endDay = format(endDate, 'd');
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  return (
    <Card className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="space-y-4">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <div className="text-sm font-semibold text-gray-800">
              Week {currentWeekOffset + 1}
            </div>
            <div className="text-xs text-gray-600">
              {formatWeekRange(weekStartDate)}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3} // 4-week program
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Day Selector */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {shortDayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isRest = isRestDay(dayNumber);
            const hasData = hasWorkoutData(dayNumber);
            
            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "outline"}
                className={`text-xs sm:text-sm py-2 sm:py-3 ${
                  isSelected 
                    ? 'bg-fitness-gradient text-white shadow-lg' 
                    : isRest
                    ? 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200'
                    : hasData
                    ? 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                    : 'bg-white/80 hover:bg-gray-50 text-gray-600'
                }`}
                onClick={() => setSelectedDayNumber(dayNumber)}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">{day}</span>
                  <span className="text-xs opacity-75">
                    {isRest ? (
                      <span className="text-orange-600">Rest</span>
                    ) : hasData ? (
                      <span className="text-green-600">●</span>
                    ) : (
                      <span className="text-gray-400">○</span>
                    )}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span className="hidden sm:inline">{t('exercise.hasWorkout') || 'Has Workout'}</span>
            <span className="sm:hidden">Workout</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
            <span className="hidden sm:inline">{t('exercise.restDay') || 'Rest Day'}</span>
            <span className="sm:hidden">Rest</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
            <span className="hidden sm:inline">{t('exercise.noWorkout') || 'No Workout'}</span>
            <span className="sm:hidden">Empty</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
