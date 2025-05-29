
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, addDays, startOfWeek } from "date-fns";

interface ExerciseDaySelectorProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  currentProgram: any;
}

export const ExerciseDaySelector = ({
  selectedDayNumber,
  setSelectedDayNumber,
  currentProgram
}: ExerciseDaySelectorProps) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => ({
    number: i + 1,
    name: format(addDays(weekStart, i), 'EEE'),
    fullName: format(addDays(weekStart, i), 'EEEE'),
    date: addDays(weekStart, i)
  }));

  const getWorkoutForDay = (dayNumber: number) => {
    return currentProgram?.daily_workouts?.find(
      (workout: any) => workout.day_number === dayNumber
    );
  };

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Day</h3>
        <Badge variant="outline" className="bg-white/80">
          {daysOfWeek.find(d => d.number === selectedDayNumber)?.fullName}
        </Badge>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => {
          const workout = getWorkoutForDay(day.number);
          const isSelected = selectedDayNumber === day.number;
          const isRestDay = !workout;
          
          return (
            <Button
              key={day.number}
              variant={isSelected ? "default" : "outline"}
              onClick={() => setSelectedDayNumber(day.number)}
              className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                isSelected 
                  ? "bg-fitness-primary text-white" 
                  : "bg-white/80 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs font-medium">{day.name}</span>
              <span className="text-xs">{day.number}</span>
              {isRestDay ? (
                <span className="text-xs opacity-70">Rest</span>
              ) : (
                <div className="w-2 h-2 bg-current rounded-full" />
              )}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
