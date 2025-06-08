
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays, addWeeks, subWeeks } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { WeekContentLoader } from "@/components/exercise/WeekContentLoader";
import { EnhancedWorkoutTypeToggle } from "@/components/exercise/EnhancedWorkoutTypeToggle";
import { useState } from "react";

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
  const [isChangingWeek, setIsChangingWeek] = useState(false);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay() || 7; // Convert Sunday (0) to 7

  const handlePreviousWeek = () => {
    setIsChangingWeek(true);
    setTimeout(() => {
      onWeekChange(currentWeekOffset - 1);
      setIsChangingWeek(false);
    }, 100);
  };

  const handleNextWeek = () => {
    setIsChangingWeek(true);
    setTimeout(() => {
      onWeekChange(currentWeekOffset + 1);
      setIsChangingWeek(false);
    }, 100);
  };

  const handleDayClick = (dayNumber: number) => {
    onDayChange(dayNumber);
  };

  const getWorkoutStatusForDay = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return { isRestDay: false, isCompleted: false };
    
    const workout = currentProgram.daily_workouts.find(
      (w: any) => w.day_number === dayNumber
    );
    
    if (!workout) return { isRestDay: false, isCompleted: false };
    
    return {
      isRestDay: workout.is_rest_day || false,
      isCompleted: workout.completed || false,
      muscleGroups: workout.muscle_groups || []
    };
  };

  const weekEndDate = addDays(weekStartDate, 6);
  const weekLabel = `${format(weekStartDate, 'MMM d')} - ${format(weekEndDate, 'MMM d')}`;
  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <div className="space-y-4">
      {/* Workout Type Toggle - Add this section */}
      <EnhancedWorkoutTypeToggle
        workoutType={workoutType}
        onWorkoutTypeChange={onWorkoutTypeChange}
      />
      
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg relative">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousWeek}
            className="h-8 px-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="ml-1">{t('Previous')}</span>
          </Button>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            <span className="font-medium">
              {isCurrentWeek ? t('Current Week') : weekLabel}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            className="h-8 px-2"
          >
            <span className="mr-1">{t('Next')}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Day Selection */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((dayName, index) => {
            const dayNumber = index + 1;
            const isSelected = dayNumber === selectedDayNumber;
            const isToday = dayNumber === today && isCurrentWeek;
            const { isRestDay, isCompleted } = getWorkoutStatusForDay(dayNumber);
            const currentDate = addDays(weekStartDate, index);
            
            return (
              <Button
                key={dayNumber}
                variant={isSelected ? "default" : "ghost"}
                className={`
                  flex flex-col items-center p-2 h-auto
                  ${isSelected ? 'bg-blue-600 text-white' : ''}
                  ${isToday && !isSelected ? 'border border-blue-300' : ''}
                  ${isRestDay ? 'bg-gray-100 text-gray-500' : ''}
                  ${isCompleted && !isSelected ? 'bg-green-100 text-green-700' : ''}
                `}
                onClick={() => handleDayClick(dayNumber)}
              >
                <span className="text-xs font-medium mb-1">{dayName}</span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                  {format(currentDate, 'd')}
                </span>
                {isRestDay && (
                  <span className="text-xs mt-1">
                    {t('Rest')}
                  </span>
                )}
                {!isRestDay && isCompleted && (
                  <span className="text-xs mt-1">
                    ✓
                  </span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Week Content Loader Overlay */}
        <WeekContentLoader 
          weekNumber={currentWeekOffset + 1} 
          isVisible={isChangingWeek} 
        />
      </Card>
    </div>
  );
};
