
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
    <Card className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className={`flex items-center justify-between mb-3 sm:mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          {t('exercise.selectDay') || 'Select Day'}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {shortDayNames.map((day, index) => {
          const dayNumber = index + 1;
          const isSelected = selectedDayNumber === dayNumber;
          const isRest = isRestDay(dayNumber);
          const hasData = hasWorkoutData(dayNumber);
          
          return (
            <Button
              key={day}
              variant={isSelected ? "default" : "outline"}
              className={`text-xs sm:text-sm py-2 sm:py-3 ${
                isSelected 
                  ? 'bg-fitness-gradient text-white shadow-lg' 
                  : isRest
                  ? 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200'
                  : hasData
                  ? 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                  : 'bg-white/80 hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => setSelectedDayNumber(dayNumber)}
            >
              <div className="flex flex-col items-center">
                <span className="font-medium">{day}</span>
                <span className="text-xs opacity-75">
                  {isRest ? (
                    <span className="text-orange-600">Rest</span>
                  ) : hasData ? (
                    <span className="text-green-600">●</span>
                  ) : (
                    <span className="text-gray-400">○</span>
                  )}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-3 text-center">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <span>{t('exercise.hasWorkout') || 'Has Workout'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
            <span>{t('exercise.restDay') || 'Rest Day'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-gray-300 rounded-full mr-1"></div>
            <span>{t('exercise.noWorkout') || 'No Workout'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
