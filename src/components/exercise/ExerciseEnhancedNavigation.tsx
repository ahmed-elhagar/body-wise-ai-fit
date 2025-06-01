
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RotateCcw, Calendar, Target } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { hasRealWorkoutData, isRestDay, getTrainingDays, getRestDays } from "@/utils/exerciseDataUtils";

interface ExerciseEnhancedNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
  hasDataForCurrentWeek: boolean;
  onGenerateForWeek?: () => void;
}

export const ExerciseEnhancedNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
  workoutType,
  hasDataForCurrentWeek,
  onGenerateForWeek
}: ExerciseEnhancedNavigationProps) => {
  const { t } = useLanguage();
  const shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get training and rest days from AI response
  const trainingDays = currentProgram?.daily_workouts ? getTrainingDays(currentProgram.daily_workouts) : [];
  const restDays = currentProgram?.daily_workouts ? getRestDays(currentProgram.daily_workouts) : [];

  // Check if day has real workout data (not empty placeholders)
  const hasWorkoutData = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return false;
    const dayWorkout = currentProgram.daily_workouts.find((workout: any) => 
      workout.day_number === dayNumber
    );
    return dayWorkout ? hasRealWorkoutData(dayWorkout) : false;
  };

  const isDayRestDay = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return false;
    return isRestDay(dayNumber, currentProgram.daily_workouts);
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

  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
    setSelectedDayNumber(new Date().getDay() || 7);
  };

  const getWeekSummary = () => {
    if (!currentProgram?.daily_workouts) return null;
    
    const totalWorkouts = trainingDays.length;
    const totalRestDays = restDays.length;
    
    return {
      totalWorkouts,
      totalRestDays,
      trainingPattern: trainingDays.join(', ')
    };
  };

  const weekSummary = getWeekSummary();

  return (
    <Card className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="space-y-4">
        {/* Week Navigation Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center flex-1">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-fitness-primary" />
              <span className="text-sm font-semibold text-gray-800">
                {t('exercise.week')} {currentWeekOffset + 1}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              {formatWeekRange(weekStartDate)}
            </div>
            
            {/* Week Summary */}
            {weekSummary && hasDataForCurrentWeek && (
              <div className="flex items-center justify-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-green-600" />
                  <span className="text-green-600">{weekSummary.totalWorkouts} workouts</span>
                </div>
                <div className="text-orange-600">{weekSummary.totalRestDays} rest days</div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3} // 4-week program limit
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions for Navigation Issues */}
        {!hasDataForCurrentWeek && (
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-full text-center border border-amber-200">
              {t('exercise.noDataForWeek')}
            </div>
            <div className="flex gap-2">
              {currentWeekOffset > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToCurrentWeek}
                  className="text-xs h-7 px-3 border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {t('exercise.goBackToCurrentWeek')}
                </Button>
              )}
              {onGenerateForWeek && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onGenerateForWeek}
                  className="text-xs h-7 px-3 bg-fitness-gradient hover:opacity-90"
                >
                  {t('exercise.generateForThisWeek')}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Day Selector */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {shortDayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isRest = isDayRestDay(dayNumber);
            const hasData = hasWorkoutData(dayNumber);
            const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
            
            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "outline"}
                className={`text-xs sm:text-sm py-2 sm:py-3 relative transition-all duration-200 ${
                  isSelected 
                    ? 'bg-fitness-gradient text-white shadow-lg scale-105' 
                    : isRest
                    ? 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200'
                    : hasData
                    ? 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                    : 'bg-white/80 hover:bg-gray-50 text-gray-600'
                } ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}
                onClick={() => setSelectedDayNumber(dayNumber)}
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">{day}</span>
                  <span className="text-xs opacity-75">
                    {isRest ? (
                      <span className="text-orange-600 font-medium">Rest</span>
                    ) : hasData ? (
                      <span className="text-green-600 text-lg leading-none">●</span>
                    ) : (
                      <span className="text-gray-400 text-lg leading-none">○</span>
                    )}
                  </span>
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Enhanced Legend */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-gray-600 bg-gray-50/80 py-2 px-3 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="hidden sm:inline">{t('exercise.hasWorkout')}</span>
            <span className="sm:hidden">Workout</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
            <span className="hidden sm:inline">{t('exercise.restDay')}</span>
            <span className="sm:hidden">Rest</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
            <span className="hidden sm:inline">{t('exercise.noWorkout')}</span>
            <span className="sm:hidden">Empty</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="hidden sm:inline">Today</span>
            <span className="sm:hidden">Today</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
