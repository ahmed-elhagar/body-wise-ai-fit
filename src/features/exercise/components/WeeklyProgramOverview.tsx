
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell } from "lucide-react";
import { ProgramTypeIndicator } from "./ProgramTypeIndicator";

interface WeeklyProgramOverviewProps {
  currentProgram: any;
  selectedDay: number;
  onDaySelect: (day: number) => void;
  workoutType: "home" | "gym";
}

export const WeeklyProgramOverview = ({ 
  currentProgram, 
  selectedDay, 
  onDaySelect,
  workoutType 
}: WeeklyProgramOverviewProps) => {
  if (!currentProgram) return null;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-fitness-primary" />
          <h3 className="text-lg font-semibold text-gray-800">Weekly Program Overview</h3>
          <ProgramTypeIndicator type={workoutType} />
        </div>
        <Badge variant="outline" className="bg-white/80">
          Week {currentProgram.current_week || 1} of 4
        </Badge>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {daysOfWeek.map((day, index) => {
          const dayNumber = index + 1;
          const isSelected = selectedDay === dayNumber;
          const isRestDay = dayNumber === 7; // Sunday as rest day by default
          
          return (
            <Button
              key={dayNumber}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onDaySelect(dayNumber)}
              className={`h-20 flex flex-col items-center justify-center space-y-1 ${
                isSelected 
                  ? "bg-fitness-primary text-white" 
                  : "bg-white/80 hover:bg-gray-50"
              }`}
            >
              <span className="text-xs font-medium">{day}</span>
              <span className="text-xs">{dayNumber}</span>
              {isRestDay ? (
                <span className="text-xs opacity-70">Rest</span>
              ) : (
                <Dumbbell className="w-3 h-3" />
              )}
            </Button>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Showing {workoutType === "home" ? "home" : "gym"} workouts for day {selectedDay}
        </p>
      </div>
    </Card>
  );
};
