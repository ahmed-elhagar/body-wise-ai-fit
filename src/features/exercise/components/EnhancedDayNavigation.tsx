
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
    <Card className="p-4 bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-2xl">
      <div className="space-y-4">
        {/* Enhanced Header with Better Layout */}
        <div className="flex items-center justify-between">
          {/* Week Navigation - Improved Design */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 border border-gray-200 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="text-center min-w-[140px]">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-2 shadow-sm">
                <div className="text-sm font-bold text-gray-900 flex items-center justify-center gap-2">
                  <span className="text-blue-600">Week {currentWeekOffset + 1}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-xs">{formatWeekRange(weekStartDate)}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 border border-gray-200 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Enhanced Workout Type Toggle */}
          <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-sm border border-gray-200">
            <Button
              variant={workoutType === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('home')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                workoutType === 'home' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant={workoutType === 'gym' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onWorkoutTypeChange('gym')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                workoutType === 'gym' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
              }`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Gym
            </Button>
          </div>
        </div>

        {/* Enhanced Day Grid with Better Visual Design */}
        <div className="grid grid-cols-7 gap-2">
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
                  relative h-auto p-3 flex flex-col items-center gap-2 transition-all duration-300 text-xs
                  ${isSelected 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-105 transform' 
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                  }
                  ${isToday ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                  rounded-xl
                `}
              >
                {/* Day Label */}
                <div className="text-xs font-bold uppercase tracking-wider">
                  {day}
                </div>
                
                {/* Date */}
                <div className="text-sm font-bold">
                  {format(dayDate, 'd')}
                </div>

                {/* Enhanced Progress Indicator */}
                {status !== 'rest' && status !== 'empty' && (
                  <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        isSelected ? 'bg-white/90' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Enhanced Status Badge */}
                <div className="flex items-center gap-1">
                  {status === 'rest' ? (
                    <>
                      <Coffee className={`w-3 h-3 ${isSelected ? 'text-orange-200' : 'text-orange-500'}`} />
                      <Badge 
                        variant="outline" 
                        className={`border-0 text-xs px-2 py-0.5 transition-colors duration-200 ${
                          isSelected 
                            ? 'bg-orange-500/20 text-orange-200' 
                            : 'bg-orange-100 text-orange-600 hover:bg-orange-200 hover:text-orange-700'
                        }`}
                      >
                        Rest
                      </Badge>
                    </>
                  ) : status === 'completed' ? (
                    <>
                      <CheckCircle className={`w-3 h-3 ${isSelected ? 'text-green-200' : 'text-green-500'}`} />
                      <Badge 
                        variant="outline" 
                        className={`border-0 text-xs px-2 py-0.5 transition-colors duration-200 ${
                          isSelected 
                            ? 'bg-green-500/20 text-green-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700'
                        }`}
                      >
                        Done
                      </Badge>
                    </>
                  ) : status === 'in-progress' ? (
                    <>
                      <Target className={`w-3 h-3 ${isSelected ? 'text-yellow-200' : 'text-yellow-500'}`} />
                      <Badge 
                        variant="outline" 
                        className={`border-0 text-xs px-2 py-0.5 transition-colors duration-200 ${
                          isSelected 
                            ? 'bg-yellow-500/20 text-yellow-200' 
                            : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 hover:text-yellow-700'
                        }`}
                      >
                        {progress}%
                      </Badge>
                    </>
                  ) : status === 'scheduled' ? (
                    <>
                      <Target className={`w-3 h-3 ${isSelected ? 'text-blue-200' : 'text-blue-500'}`} />
                      <Badge 
                        variant="outline" 
                        className={`border-0 text-xs px-2 py-0.5 transition-colors duration-200 ${
                          isSelected 
                            ? 'bg-blue-500/20 text-blue-200' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700'
                        }`}
                      >
                        Ready
                      </Badge>
                    </>
                  ) : (
                    <div className="h-5" />
                  )}
                </div>

                {/* Enhanced Today Indicator */}
                {isToday && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
