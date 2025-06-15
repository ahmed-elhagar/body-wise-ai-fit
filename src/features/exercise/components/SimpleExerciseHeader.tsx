
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Home, Building2, Dumbbell } from "lucide-react";
import { format, addDays } from "date-fns";

interface SimpleExerciseHeaderProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  weekStartDate: Date;
  workoutType: "home" | "gym";
  setWorkoutType: (type: "home" | "gym") => void;
  currentProgram: any;
}

export const SimpleExerciseHeader = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  weekStartDate,
  workoutType,
  setWorkoutType,
  currentProgram
}: SimpleExerciseHeaderProps) => {
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

  return (
    <Card className="p-4 bg-white shadow-sm border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left - Week Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center min-w-[120px]">
            <div className="text-sm font-semibold text-gray-900">
              Week {currentWeekOffset + 1}
            </div>
            <div className="text-xs text-gray-600">
              {formatWeekRange(weekStartDate)}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Center - Program Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Exercise Program</h1>
            {currentProgram && (
              <div className="text-xs text-gray-600">
                {currentProgram.goal_type?.replace('_', ' ') || 'General Fitness'}
              </div>
            )}
          </div>
        </div>

        {/* Right - Workout Type Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={workoutType === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setWorkoutType("home")}
            className={`h-8 px-3 text-xs ${
              workoutType === "home" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Home className="w-3 h-3 mr-1" />
            Home
          </Button>
          
          <Button
            variant={workoutType === "gym" ? "default" : "ghost"}
            size="sm"
            onClick={() => setWorkoutType("gym")}
            className={`h-8 px-3 text-xs ${
              workoutType === "gym" 
                ? "bg-purple-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Building2 className="w-3 h-3 mr-1" />
            Gym
          </Button>
        </div>
      </div>
    </Card>
  );
};
