
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Home, Building2, Target, Coffee } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface ModernExerciseNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  workoutType: "home" | "gym";
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  currentProgram: any;
}

export const ModernExerciseNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  workoutType,
  onWorkoutTypeChange,
  currentProgram
}: ModernExerciseNavigationProps) => {
  const { t } = useLanguage();

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    const startMonth = format(startDate, 'MMM');
    const startDay = format(startDate, 'd');
    const endMonth = format(endDate, 'MMM');
    const endDay = format(endDate, 'd');
    const year = format(startDate, 'yyyy');
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const isCurrentWeek = currentWeekOffset === 0;

  // Get workout data for each day
  const getDayWorkout = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return null;
    return currentProgram.daily_workouts.find((workout: any) => workout.day_number === dayNumber);
  };

  const getDayStatus = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    if (!workout) return 'empty';
    if (workout.is_rest_day) return 'rest';
    if (workout.exercises?.length > 0) return 'workout';
    return 'empty';
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <div className="flex items-center justify-between">
          {/* Week Info */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
              disabled={currentWeekOffset === 0}
              className="h-10 w-10 p-0 rounded-xl hover:bg-white/80 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="text-center">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Week {currentWeekOffset + 1}
                  </h2>
                  <p className="text-sm text-gray-600 font-medium">
                    {formatWeekRange(weekStartDate)}
                  </p>
                </div>
              </div>
              
              {isCurrentWeek && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1 text-xs font-semibold shadow-md">
                  Current Week
                </Badge>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              disabled={currentWeekOffset >= 3}
              className="h-10 w-10 p-0 rounded-xl hover:bg-white/80 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Workout Type Toggle */}
          <div className="bg-white rounded-2xl p-1 shadow-lg border border-gray-200">
            <div className="flex">
              <button
                onClick={() => onWorkoutTypeChange("home")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  workoutType === "home"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                    : "text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => onWorkoutTypeChange("gym")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  workoutType === "gym"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Gym
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Day Selector */}
      <Card className="p-4 bg-white border border-gray-200">
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
            const status = getDayStatus(dayNumber);
            
            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "outline"}
                className={`h-20 p-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-sm font-medium relative ${
                  isSelected 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl scale-105 z-10 border-0' 
                    : status === 'rest'
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200'
                    : status === 'workout'
                    ? 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                } ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                onClick={() => setSelectedDayNumber(dayNumber)}
              >
                {/* Day Name */}
                <span className="font-bold mb-1">{day}</span>
                
                {/* Status Indicator */}
                <div className="flex flex-col items-center">
                  {status === 'rest' ? (
                    <>
                      <Coffee className="w-4 h-4 mb-1" />
                      <span className="text-xs opacity-75">Rest</span>
                    </>
                  ) : status === 'workout' ? (
                    <>
                      <Target className="w-4 h-4 mb-1" />
                      <span className="text-xs opacity-75">Workout</span>
                    </>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-current opacity-30 mb-1" />
                  )}
                </div>
                
                {/* Today indicator */}
                {isToday && !isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600 bg-gray-50/80 py-3 px-4 rounded-2xl mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Workout Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Rest Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>No Plan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Today</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
