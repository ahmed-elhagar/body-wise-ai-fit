
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Moon, Dumbbell } from "lucide-react";
import { format, addDays, isToday } from "date-fns";

interface SimpleDaySelectorProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  weekStartDate: Date;
  currentProgram: any;
}

export const SimpleDaySelector = ({
  selectedDayNumber,
  setSelectedDayNumber,
  weekStartDate,
  currentProgram
}: SimpleDaySelectorProps) => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getDayWorkout = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return null;
    return currentProgram.daily_workouts.find((workout: any) => workout.day_number === dayNumber);
  };

  return (
    <Card className="p-3 bg-white shadow-sm border-gray-200">
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day, index) => {
          const dayNumber = index + 1;
          const currentDate = addDays(weekStartDate, index);
          const isDayToday = isToday(currentDate);
          const isSelected = selectedDayNumber === dayNumber;
          const dayWorkout = getDayWorkout(dayNumber);
          const isRestDay = dayWorkout?.is_rest_day;
          const isCompleted = dayWorkout?.completed;
          const hasExercises = dayWorkout?.exercises?.length > 0;

          return (
            <Button
              key={dayNumber}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDayNumber(dayNumber)}
              className={`relative h-14 p-1 flex flex-col items-center justify-center text-xs transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : isDayToday 
                  ? 'border-blue-300 bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-medium mb-1">{day}</span>
              <span className="text-xs font-bold">{format(currentDate, 'd')}</span>
              
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 flex">
                {isDayToday && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
                {isCompleted && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {isRestDay && (
                  <Moon className="w-3 h-3 text-blue-500" />
                )}
                {hasExercises && !isRestDay && !isCompleted && (
                  <Dumbbell className="w-3 h-3 text-gray-400" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-2 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>Done</span>
        </div>
        <div className="flex items-center gap-1">
          <Moon className="w-3 h-3 text-blue-500" />
          <span>Rest</span>
        </div>
      </div>
    </Card>
  );
};
