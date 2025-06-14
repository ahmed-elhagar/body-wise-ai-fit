
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Home, Building2, Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseCompactNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  isGenerating?: boolean;
}

export const ExerciseCompactNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
  workoutType,
  setWorkoutType,
  isGenerating = false
}: ExerciseCompactNavigationProps) => {
  const { t } = useLanguage();
  const shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getRestDays = (type: "home" | "gym") => {
    return type === "home" ? [3, 6, 7] : [4, 7];
  };

  const restDays = getRestDays(workoutType);

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
    <Card className="p-3 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl">
      <div className="space-y-3">
        {/* Compact Week Navigation + Gym/Home Toggle in one line */}
        <div className="flex items-center justify-between gap-3">
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
              disabled={currentWeekOffset === 0 || isGenerating}
              className="h-7 w-7 p-0 rounded-md"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>

            <div className="text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-semibold text-gray-800">Week {currentWeekOffset + 1}</span>
              </div>
              <div className="text-xs text-gray-600">
                {formatWeekRange(weekStartDate)}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(Math.min(3, currentWeekOffset + 1))}
              disabled={currentWeekOffset >= 3 || isGenerating}
              className="h-7 w-7 p-0 rounded-md"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* Gym/Home Toggle - Compact */}
          <div className="flex items-center gap-1">
            <Button
              variant={workoutType === "home" ? "default" : "outline"}
              size="sm"
              onClick={() => setWorkoutType("home")}
              disabled={isGenerating}
              className={`h-7 px-2 text-xs ${
                workoutType === "home" 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-white hover:bg-green-50 border-green-200 text-green-700"
              }`}
            >
              <Home className="w-3 h-3 mr-1" />
              Home
            </Button>
            
            <Button
              variant={workoutType === "gym" ? "default" : "outline"}
              size="sm"
              onClick={() => setWorkoutType("gym")}
              disabled={isGenerating}
              className={`h-7 px-2 text-xs ${
                workoutType === "gym" 
                  ? "bg-purple-500 hover:bg-purple-600 text-white" 
                  : "bg-white hover:bg-purple-50 border-purple-200 text-purple-700"
              }`}
            >
              <Building2 className="w-3 h-3 mr-1" />
              Gym
            </Button>
          </div>

          {/* Status Badge */}
          {currentWeekOffset === 0 ? (
            <Badge variant="secondary" className="bg-green-500 text-white text-xs px-2 py-0.5">
              Current
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs px-2 py-0.5">
              Week {currentWeekOffset + 1}
            </Badge>
          )}
        </div>

        {/* Day Selector - More Compact */}
        <div className="grid grid-cols-7 gap-1">
          {shortDayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isRest = isRestDay(dayNumber);
            const hasData = hasWorkoutData(dayNumber);
            
            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDayNumber(dayNumber)}
                disabled={isGenerating}
                className={`h-10 flex flex-col gap-0.5 text-xs ${
                  isSelected 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                    : isRest
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
                    : hasData
                    ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200'
                    : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                <span className="font-medium text-xs">{day}</span>
                <span className="text-xs opacity-75">
                  {isRest ? (
                    <span className="text-orange-600 text-xs">Rest</span>
                  ) : hasData ? (
                    <span className="text-green-600">●</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
