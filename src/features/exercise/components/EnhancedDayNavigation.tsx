
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Moon } from "lucide-react";
import { format, addDays, isToday, isSameDay } from "date-fns";

interface EnhancedDayNavigationProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  weekStartDate: Date;
  currentProgram: any;
}

export const EnhancedDayNavigation = ({
  selectedDayNumber,
  setSelectedDayNumber,
  weekStartDate,
  currentProgram
}: EnhancedDayNavigationProps) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, index) => {
          const dayNumber = index + 1;
          const currentDate = addDays(weekStartDate, index);
          const isDayToday = isToday(currentDate);
          const isSelected = selectedDayNumber === dayNumber;
          const dayWorkout = currentProgram?.daily_workouts?.find(
            (workout: any) => workout.day_number === dayNumber
          );
          const isRestDay = dayWorkout?.is_rest_day;
          const isCompleted = dayWorkout?.completed;

          return (
            <Button
              key={dayNumber}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDayNumber(dayNumber)}
              className={`relative flex-col h-16 p-2 transition-all duration-200 ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : isDayToday 
                  ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-xs font-medium mb-1">{day}</div>
              <div className="text-lg font-bold">
                {format(currentDate, 'd')}
              </div>
              
              {/* Status indicators */}
              <div className="absolute -top-1 -right-1">
                {isCompleted && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {isRestDay && (
                  <Moon className="w-3 h-3 text-blue-500" />
                )}
                {isDayToday && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <Moon className="w-3 h-3 text-blue-500" />
          <span>Rest Day</span>
        </div>
      </div>
    </div>
  );
};
