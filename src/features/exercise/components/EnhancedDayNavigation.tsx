
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
    <Card className="p-4 bg-white border border-gray-200 rounded-lg">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Week Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-7 w-7 p-0 rounded-md hover:bg-gray-100"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-md px-2 py-1">
              <div className="text-xs font-medium text-gray-900 flex items-center gap-1">
                <span className="text-blue-600">Week {currentWeekOffset + 1}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{formatWeekRange(weekStartDate)}</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-7 w-7 p-0 rounded-md hover:bg-gray-100"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>

          {/* Workout Type Toggle */}
          <div className="flex items-center bg-gray-50 rounded-md p-0.5">
            <Button
              variant={workoutType === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('home')}
              className={`rounded-sm px-2 py-1 text-xs font-medium h-6 ${
                workoutType === 'home' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-transparent'
              }`}
            >
              <Home className="w-3 h-3 mr-1" />
              Home
            </Button>
            <Button
              variant={workoutType === 'gym' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('gym')}
              className={`rounded-sm px-2 py-1 text-xs font-medium h-6 ${
                workoutType === 'gym' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-transparent'
              }`}
            >
              <Building2 className="w-3 h-3 mr-1" />
              Gym
            </Button>
          </div>
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
            const status = getDayStatus(dayNumber);
            const progress = getDayProgress(dayNumber);

            // Simplified status-based styling
            let bgColor, textColor, statusIcon;
            
            if (isSelected) {
              bgColor = 'bg-blue-600';
              textColor = 'text-white';
            } else {
              switch (status) {
                case 'completed':
                  bgColor = 'bg-green-50 hover:bg-green-100';
                  textColor = 'text-green-800';
                  statusIcon = <CheckCircle className="w-3 h-3 text-green-600" />;
                  break;
                case 'in-progress':
                  bgColor = 'bg-yellow-50 hover:bg-yellow-100';
                  textColor = 'text-yellow-800';
                  statusIcon = <Target className="w-3 h-3 text-yellow-600" />;
                  break;
                case 'ready':
                  bgColor = 'bg-blue-50 hover:bg-blue-100';
                  textColor = 'text-blue-800';
                  statusIcon = <Target className="w-3 h-3 text-blue-600" />;
                  break;
                case 'rest':
                  bgColor = 'bg-orange-50 hover:bg-orange-100';
                  textColor = 'text-orange-800';
                  statusIcon = <Coffee className="w-3 h-3 text-orange-600" />;
                  break;
                default:
                  bgColor = 'bg-gray-50 hover:bg-gray-100';
                  textColor = 'text-gray-600';
              }
            }

            return (
              <Button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                variant="ghost"
                className={`
                  relative h-12 p-1 flex flex-col items-center gap-0.5 transition-colors text-xs
                  ${bgColor} ${textColor} border-0
                  ${isToday ? 'ring-1 ring-blue-400' : ''}
                  rounded-md
                `}
              >
                {/* Day Label */}
                <div className="text-xs font-medium">{day}</div>
                
                {/* Status Icon */}
                <div className="flex items-center justify-center">
                  {isSelected ? (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  ) : (
                    statusIcon || <div className="w-2 h-2" />
                  )}
                </div>

                {/* Progress Bar for workouts */}
                {status !== 'rest' && status !== 'empty' && !isSelected && (
                  <div className="w-4 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-current opacity-60 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Today indicator */}
                {isToday && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
