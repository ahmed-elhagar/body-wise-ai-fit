
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDayNames } from "@/utils/mealPlanUtils";

interface ExerciseDaySelectorProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
}

export const ExerciseDaySelector = ({
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram,
  workoutType
}: ExerciseDaySelectorProps) => {
  const { t, isRTL } = useLanguage();
  const dayNames = getDayNames(t);
  const shortDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Define rest days based on workout type
  const getRestDays = (type: "home" | "gym") => {
    return type === "home" ? [3, 6, 7] : [4, 7]; // Wed, Sat, Sun for home; Thu, Sun for gym
  };

  const restDays = getRestDays(workoutType);

  // Check if day has workout data
  const hasWorkoutData = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return false;
    return currentProgram.daily_workouts.some((workout: any) => 
      workout.day_number === dayNumber && !workout.is_rest_day
    );
  };

  const isRestDay = (dayNumber: number) => {
    return restDays.includes(dayNumber);
  };

  return (
    <Card className="mb-6 p-5 bg-gradient-to-br from-white to-health-soft/30 border-2 border-health-border/30 shadow-lg backdrop-blur-sm rounded-2xl">
      <div className={`flex items-center justify-between mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className="text-lg font-bold text-health-text-primary">
          {t('exercise.selectDay') || 'Select Day'}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
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
              className={`py-3 px-2 flex flex-col items-center space-y-1 transition-all duration-300 transform ${
                isSelected 
                  ? 'bg-gradient-to-br from-health-primary to-health-primary/90 text-white shadow-lg shadow-health-primary/25 scale-105 border-2 border-health-primary' 
                  : isRest
                  ? 'bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-2 border-orange-200 hover:border-orange-300'
                  : hasData
                  ? 'bg-gradient-to-br from-health-secondary/10 to-health-secondary/20 hover:from-health-secondary/20 hover:to-health-secondary/30 text-health-secondary border-2 border-health-secondary/30 hover:border-health-secondary/50'
                  : 'bg-white hover:bg-health-soft border-2 border-health-border/30 hover:border-health-border text-health-text-secondary'
              } rounded-xl hover:scale-105 active:scale-95`}
              onClick={() => setSelectedDayNumber(dayNumber)}
            >
              <span className="font-bold text-xs">{day}</span>
              <div className="flex items-center justify-center h-3">
                {isRest ? (
                  <span className="text-orange-500 font-bold text-xs">Rest</span>
                ) : hasData ? (
                  <div className="w-2 h-2 bg-health-secondary rounded-full shadow-sm"></div>
                ) : (
                  <div className="w-2 h-2 bg-health-text-secondary/30 rounded-full"></div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-6 text-xs text-health-text-secondary bg-white/60 rounded-xl p-3 border border-health-border/20">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-health-secondary rounded-full shadow-sm"></div>
            <span className="font-medium">{t('exercise.hasWorkout') || 'Has Workout'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
            <span className="font-medium">{t('exercise.restDay') || 'Rest Day'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-health-text-secondary/30 rounded-full"></div>
            <span className="font-medium">{t('exercise.noWorkout') || 'No Workout'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
