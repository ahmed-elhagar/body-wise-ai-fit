
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    return 'ready';
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
    <Card className="p-4 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-sm rounded-xl">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <div className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                <span className="text-blue-600">Week {currentWeekOffset + 1}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{formatWeekRange(weekStartDate)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Workout Type Toggle */}
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

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
            const status = getDayStatus(dayNumber);
            const progress = getDayProgress(dayNumber);

            // Status-based styling
            let bgColor, textColor, borderColor, statusIcon;
            
            if (isSelected) {
              bgColor = 'bg-gradient-to-br from-blue-600 to-indigo-600';
              textColor = 'text-white';
              borderColor = 'border-blue-300';
            } else {
              switch (status) {
                case 'completed':
                  bgColor = 'bg-green-50 hover:bg-green-100';
                  textColor = 'text-green-800';
                  borderColor = 'border-green-200';
                  statusIcon = <CheckCircle className="w-3 h-3 text-green-600" />;
                  break;
                case 'in-progress':
                  bgColor = 'bg-yellow-50 hover:bg-yellow-100';
                  textColor = 'text-yellow-800';
                  borderColor = 'border-yellow-200';
                  statusIcon = <Target className="w-3 h-3 text-yellow-600" />;
                  break;
                case 'ready':
                  bgColor = 'bg-blue-50 hover:bg-blue-100';
                  textColor = 'text-blue-800';
                  borderColor = 'border-blue-200';
                  statusIcon = <Target className="w-3 h-3 text-blue-600" />;
                  break;
                case 'rest':
                  bgColor = 'bg-orange-50 hover:bg-orange-100';
                  textColor = 'text-orange-800';
                  borderColor = 'border-orange-200';
                  statusIcon = <Coffee className="w-3 h-3 text-orange-600" />;
                  break;
                default:
                  bgColor = 'bg-gray-50 hover:bg-gray-100';
                  textColor = 'text-gray-600';
                  borderColor = 'border-gray-200';
              }
            }

            return (
              <Button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                variant="ghost"
                className={`
                  relative h-14 p-2 flex flex-col items-center gap-1 transition-all duration-200 text-xs
                  ${bgColor} ${textColor} border ${borderColor}
                  ${isToday ? 'ring-2 ring-blue-400' : ''}
                  rounded-lg
                `}
              >
                {/* Day Label */}
                <div className="text-xs font-medium">{day}</div>
                
                {/* Status Icon */}
                <div className="flex items-center justify-center">
                  {isSelected ? (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  ) : (
                    statusIcon || <div className="w-3 h-3" />
                  )}
                </div>

                {/* Progress Bar for workouts */}
                {status !== 'rest' && status !== 'empty' && (
                  <div className="w-full h-1 bg-gray-200/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isSelected ? 'bg-white/90' : 'bg-current opacity-60'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Today indicator */}
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
