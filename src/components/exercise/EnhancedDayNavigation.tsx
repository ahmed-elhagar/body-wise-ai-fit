
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Coffee, Calendar, Target, ChevronLeft, ChevronRight, Home, Building2 } from "lucide-react";
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
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
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
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      {/* Compact Header Row - Week Navigation, Title, and Workout Type Toggle */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Week Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center min-w-[120px]">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 shadow-sm">
              <div className="text-sm font-bold text-gray-900">
                {formatWeekRange(weekStartDate)}
              </div>
              <div className="text-xs text-gray-600">
                Week {currentWeekOffset + 1}
              </div>
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

        {/* Center: Weekly Schedule Title */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
        </div>

        {/* Right: Workout Type Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1 shadow-sm">
          <Button
            variant={workoutType === 'home' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onWorkoutTypeChange('home')}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-all duration-200 ${
              workoutType === 'home' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Home className="w-3 h-3 mr-1" />
            Home
          </Button>
          <Button
            variant={workoutType === 'gym' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onWorkoutTypeChange('gym')}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-all duration-200 ${
              workoutType === 'gym' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Building2 className="w-3 h-3 mr-1" />
            Gym
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, index) => {
          const dayNumber = index + 1;
          const isSelected = selectedDayNumber === dayNumber;
          const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
          const status = getDayStatus(dayNumber);
          const progress = getDayProgress(dayNumber);
          const workout = getDayWorkout(dayNumber);
          const dayDate = addDays(weekStartDate, index);

          return (
            <Button
              key={dayNumber}
              onClick={() => onDayChange(dayNumber)}
              variant={isSelected ? "default" : "ghost"}
              className={`
                relative h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm'
                }
                ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
              `}
            >
              {/* Day Badge */}
              <div className="text-xs font-bold uppercase tracking-wider">
                {day}
              </div>
              
              {/* Date */}
              <div className="text-lg font-bold">
                {format(dayDate, 'd')}
              </div>

              {/* Status Icon */}
              <div className="flex items-center justify-center w-6 h-6">
                {status === 'rest' ? (
                  <Coffee className={`w-4 h-4 ${isSelected ? 'text-orange-200' : 'text-orange-500'}`} />
                ) : status === 'completed' ? (
                  <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-green-200' : 'text-green-500'}`} />
                ) : status === 'scheduled' || status === 'in-progress' ? (
                  <Target className={`w-4 h-4 ${isSelected ? 'text-blue-200' : 'text-blue-500'}`} />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-gray-300' : 'bg-gray-400'}`} />
                )}
              </div>

              {/* Progress Bar for workout days */}
              {status !== 'rest' && status !== 'empty' && (
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isSelected ? 'bg-white' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* Status Badge */}
              <div className="text-xs">
                {status === 'rest' ? (
                  <Badge variant="outline" className={`border-0 text-xs px-2 py-0.5 ${
                    isSelected ? 'bg-orange-500/20 text-orange-200' : 'bg-orange-100 text-orange-600'
                  }`}>
                    Rest
                  </Badge>
                ) : status === 'completed' ? (
                  <Badge variant="outline" className={`border-0 text-xs px-2 py-0.5 ${
                    isSelected ? 'bg-green-500/20 text-green-200' : 'bg-green-100 text-green-600'
                  }`}>
                    Done
                  </Badge>
                ) : status === 'in-progress' ? (
                  <Badge variant="outline" className={`border-0 text-xs px-2 py-0.5 ${
                    isSelected ? 'bg-yellow-500/20 text-yellow-200' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {progress}%
                  </Badge>
                ) : status === 'scheduled' ? (
                  <Badge variant="outline" className={`border-0 text-xs px-2 py-0.5 ${
                    isSelected ? 'bg-blue-500/20 text-blue-200' : 'bg-blue-100 text-blue-600'
                  }`}>
                    Ready
                  </Badge>
                ) : (
                  <div className="h-4" />
                )}
              </div>

              {/* Today indicator */}
              {isToday && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Selected Day Info */}
      {selectedDayNumber && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                {fullDayNames[selectedDayNumber - 1]}
              </h4>
              <p className="text-sm text-gray-600">
                {format(addDays(weekStartDate, selectedDayNumber - 1), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="text-right">
              {getDayWorkout(selectedDayNumber)?.is_rest_day ? (
                <p className="text-sm text-orange-600 font-medium">Rest Day</p>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getDayProgress(selectedDayNumber)}% Complete
                  </p>
                  <p className="text-xs text-gray-600">
                    {getDayWorkout(selectedDayNumber)?.exercises?.length || 0} exercises
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
