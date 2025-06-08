
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Coffee, Target, ChevronLeft, ChevronRight, Home, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addDays, addWeeks } from "date-fns";

interface EnhancedDayNavigationProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (day: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  onWorkoutTypeChange: (type: "home" | "gym") => void;
}

export const EnhancedDayNavigation = ({
  weekStartDate,
  selectedDayNumber,
  onDayChange,
  currentProgram,
  workoutType,
  currentWeekOffset,
  onWeekChange,
  onWorkoutTypeChange
}: EnhancedDayNavigationProps) => {
  const { t } = useLanguage();
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const formatWeekRange = (startDate: Date) => {
    const endDate = addWeeks(startDate, 1);
    const startFormat = format(startDate, 'MMM d');
    const endFormat = format(endDate, 'MMM d');
    return `${startFormat} - ${endFormat}`;
  };

  const getDayWorkout = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return null;
    return currentProgram.daily_workouts.find((workout: any) => workout.day_number === dayNumber);
  };

  const getDayStatus = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    if (!workout) return 'empty';
    if (workout.is_rest_day) return 'rest';
    
    const exercises = workout.exercises || [];
    const completedCount = exercises.filter((ex: any) => ex.completed).length;
    const totalCount = exercises.length;
    
    if (totalCount === 0) return 'empty';
    if (completedCount === totalCount) return 'completed';
    if (completedCount > 0) return 'in-progress';
    return 'scheduled';
  };

  const getDayProgress = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    if (!workout || workout.is_rest_day) return 0;
    
    const exercises = workout.exercises || [];
    if (exercises.length === 0) return 0;
    
    const completedCount = exercises.filter((ex: any) => ex.completed).length;
    return Math.round((completedCount / exercises.length) * 100);
  };

  return (
    <Card className="p-3 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl">
      <div className="space-y-3">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <div className="text-xs font-bold text-gray-900 flex items-center gap-1">
                <span className="text-blue-600">Week {currentWeekOffset + 1}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{formatWeekRange(weekStartDate)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-7 w-7 p-0 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* Compact Workout Type Toggle */}
          <div className="flex items-center bg-gray-50 rounded-lg p-0.5">
            <Button
              variant={workoutType === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('home')}
              className={`rounded-md px-2 py-1 text-xs font-medium h-7 ${
                workoutType === 'home' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-3 h-3 mr-1" />
              Home
            </Button>
            <Button
              variant={workoutType === 'gym' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('gym')}
              className={`rounded-md px-2 py-1 text-xs font-medium h-7 ${
                workoutType === 'gym' 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-3 h-3 mr-1" />
              Gym
            </Button>
          </div>
        </div>

        {/* Compact Day Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {dayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
            const status = getDayStatus(dayNumber);
            const progress = getDayProgress(dayNumber);
            const dayDate = addDays(weekStartDate, index);

            return (
              <Button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                variant={isSelected ? "default" : "ghost"}
                className={`
                  relative h-16 p-2 flex flex-col items-center gap-1 transition-all duration-200 text-xs
                  ${isSelected 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md scale-105' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300'
                  }
                  ${isToday ? 'ring-1 ring-blue-400' : ''}
                  rounded-lg
                `}
              >
                {/* Day Label */}
                <div className="text-xs font-semibold">
                  {day}
                </div>
                
                {/* Date */}
                <div className="text-sm font-bold">
                  {format(dayDate, 'd')}
                </div>

                {/* Compact Progress Indicator */}
                {status !== 'rest' && status !== 'empty' && (
                  <div className="w-full h-1 bg-gray-200/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isSelected ? 'bg-white/90' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Compact Status Badge */}
                <div className="flex items-center">
                  {status === 'rest' ? (
                    <Coffee className={`w-2.5 h-2.5 ${isSelected ? 'text-orange-200' : 'text-orange-500'}`} />
                  ) : status === 'completed' ? (
                    <CheckCircle className={`w-2.5 h-2.5 ${isSelected ? 'text-green-200' : 'text-green-500'}`} />
                  ) : status === 'in-progress' ? (
                    <Target className={`w-2.5 h-2.5 ${isSelected ? 'text-yellow-200' : 'text-yellow-500'}`} />
                  ) : status === 'scheduled' ? (
                    <Target className={`w-2.5 h-2.5 ${isSelected ? 'text-blue-200' : 'text-blue-500'}`} />
                  ) : (
                    <div className="w-2.5 h-2.5" />
                  )}
                </div>

                {/* Today indicator */}
                {isToday && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
