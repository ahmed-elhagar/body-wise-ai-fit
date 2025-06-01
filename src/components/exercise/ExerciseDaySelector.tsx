import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Coffee } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface ExerciseDaySelectorProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: any;
  workoutType: "home" | "gym";
}

export const ExerciseDaySelector = ({
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram
}: ExerciseDaySelectorProps) => {
  const { t } = useI18n();
  
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
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
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Select Day</h3>
          <p className="text-gray-600">Choose a day to view your workout plan</p>
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, index) => {
            const dayNumber = index + 1;
            const isSelected = selectedDayNumber === dayNumber;
            const isToday = new Date().getDay() === (dayNumber === 7 ? 0 : dayNumber);
            const status = getDayStatus(dayNumber);
            const workout = getDayWorkout(dayNumber);
            
            return (
              <div key={day} className="relative">
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full h-20 p-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center text-xs font-medium relative overflow-hidden ${
                    isSelected 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-105 z-10' 
                      : status === 'rest'
                      ? 'bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200'
                      : status === 'workout'
                      ? 'bg-green-50 hover:bg-green-100 text-green-800 border-green-200'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                  } ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}
                  onClick={() => setSelectedDayNumber(dayNumber)}
                >
                  {/* Day Name */}
                  <span className="font-semibold mb-1">{day}</span>
                  
                  {/* Status Indicator */}
                  <div className="flex flex-col items-center">
                    {status === 'rest' ? (
                      <>
                        <Coffee className="w-3 h-3 mb-1" />
                        <span className="text-xs opacity-75">Rest</span>
                      </>
                    ) : status === 'workout' ? (
                      <>
                        <CheckCircle className="w-3 h-3 mb-1" />
                        <span className="text-xs opacity-75">Workout</span>
                      </>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-current opacity-30 mb-1" />
                    )}
                  </div>
                  
                  {/* Today indicator */}
                  {isToday && !isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600 bg-gray-50/80 py-3 px-4 rounded-2xl">
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

        {/* Selected Day Info */}
        {selectedDayNumber && getDayWorkout(selectedDayNumber) && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-100">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-1">
                {fullDayNames[selectedDayNumber - 1]}
              </h4>
              <p className="text-sm text-gray-600">
                {getDayWorkout(selectedDayNumber)?.workout_name || 
                 (getDayStatus(selectedDayNumber) === 'rest' ? 'Rest Day' : 'Workout Day')}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
