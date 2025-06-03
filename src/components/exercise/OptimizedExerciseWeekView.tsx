
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Coffee } from "lucide-react";

interface WeekDay {
  dayNumber: number;
  dayName: string;
  workout: any;
  isRestDay: boolean;
  isCompleted: boolean;
  isToday: boolean;
}

interface OptimizedExerciseWeekViewProps {
  weekStructure: WeekDay[];
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

const OptimizedExerciseWeekView = React.memo<OptimizedExerciseWeekViewProps>(({ 
  weekStructure, 
  selectedDay, 
  onDaySelect 
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Week Overview
      </h3>
      
      <div className="space-y-2">
        {weekStructure.map((day) => (
          <Button
            key={day.dayNumber}
            variant={selectedDay === day.dayNumber ? "default" : "ghost"}
            className={`w-full justify-start p-3 h-auto ${
              day.isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
            }`}
            onClick={() => onDaySelect(day.dayNumber)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {day.isRestDay ? (
                  <Coffee className="w-5 h-5 text-orange-500" />
                ) : day.isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                
                <div className="text-left">
                  <div className="font-medium">
                    {day.dayName}
                    {day.isToday && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {day.isRestDay ? 'Rest Day' : day.workout?.workout_name || 'Workout'}
                  </div>
                </div>
              </div>
              
              {day.isCompleted && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Done
                </Badge>
              )}
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
});

OptimizedExerciseWeekView.displayName = 'OptimizedExerciseWeekView';

export default OptimizedExerciseWeekView;
