
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Building2, Coffee, Target, CheckCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface CompactExerciseNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  currentProgram: any;
}

export const CompactExerciseNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  workoutType,
  onWorkoutTypeChange,
  currentProgram
}: CompactExerciseNavigationProps) => {
  const { t } = useLanguage();

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

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDayWorkout = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return null;
    return currentProgram.daily_workouts.find((workout: any) => workout.day_number === dayNumber);
  };

  const getDayStatus = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    if (!workout) return 'empty';
    if (workout.workout_name?.toLowerCase().includes('rest')) return 'rest';
    if (workout.exercises?.length > 0) return 'workout';
    return 'empty';
  };

  const getDayProgress = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    if (!workout || !workout.exercises) return 0;
    const completed = workout.exercises.filter((ex: any) => ex.completed).length;
    const total = workout.exercises.length;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <Card className="p-4 bg-white border border-gray-200">
      <div className="space-y-4">
        
        {/* Week navigation and workout type */}
        <div className="flex items-center justify-between">
          {/* Week navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
              disabled={currentWeekOffset === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="text-center min-w-[140px]">
              <div className="text-sm font-semibold text-gray-900">
                Week {currentWeekOffset + 1}
              </div>
              <div className="text-xs text-gray-500">
                {formatWeekRange(weekStartDate)}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              disabled={currentWeekOffset >= 3}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Workout type toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => onWorkoutTypeChange("home")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                workoutType === "home"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home className="w-3 h-3" />
              Home
            </button>
            <button
              onClick={() => onWorkoutTypeChange("gym")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                workoutType === "gym"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="w-3 h-3" />
              Gym
            </button>
          </div>
        </div>

        {/* Day selector */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
            const status = getDayStatus(dayNumber);
            const progress = getDayProgress(dayNumber);
            
            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "ghost"}
                className={`h-16 p-1 rounded-lg transition-all text-xs font-medium flex flex-col items-center justify-center relative ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : status === 'rest'
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
                    : status === 'workout'
                    ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                } ${isToday ? 'ring-2 ring-blue-300 ring-offset-1' : ''}`}
                onClick={() => setSelectedDayNumber(dayNumber)}
              >
                {/* Day name */}
                <span className="font-semibold">{day}</span>
                
                {/* Status indicator */}
                <div className="flex items-center justify-center mt-1">
                  {status === 'rest' ? (
                    <Coffee className="w-3 h-3" />
                  ) : status === 'workout' ? (
                    progress === 100 ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Target className="w-3 h-3" />
                    )
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                  )}
                </div>
                
                {/* Progress bar for workout days */}
                {status === 'workout' && (
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isSelected 
                          ? 'bg-white' 
                          : progress === 100 
                          ? 'bg-green-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                
                {/* Today indicator */}
                {isToday && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
