
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Moon, Dumbbell, Calendar } from "lucide-react";
import { format, addDays, isToday } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface DaySelectorProps {
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  weekStartDate: Date;
  currentProgram: any;
}

export const DaySelector = ({
  selectedDayNumber,
  setSelectedDayNumber,
  weekStartDate,
  currentProgram
}: DaySelectorProps) => {
  const { t, isRTL } = useLanguage();
  
  const dayNames = [
    t('common.mon'),
    t('common.tue'), 
    t('common.wed'),
    t('common.thu'),
    t('common.fri'),
    t('common.sat'),
    t('common.sun')
  ];
  
  const getDayWorkout = (dayNumber: number) => {
    if (!currentProgram?.daily_workouts) return null;
    return currentProgram.daily_workouts.find((workout: any) => workout.day_number === dayNumber);
  };

  const getDayStatus = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    if (!workout) return 'empty';
    if (workout.is_rest_day) return 'rest';
    if (workout.completed) return 'completed';
    if (workout.exercises?.length > 0) return 'workout';
    return 'empty';
  };

  const getProgressPercentage = (dayNumber: number) => {
    const workout = getDayWorkout(dayNumber);
    if (!workout?.exercises?.length) return 0;
    const completed = workout.exercises.filter((ex: any) => ex.completed).length;
    return Math.round((completed / workout.exercises.length) * 100);
  };

  return (
    <Card className="p-4 bg-white shadow-sm border-gray-200">
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day, index) => {
          const dayNumber = index + 1;
          const currentDate = addDays(weekStartDate, index);
          const isDayToday = isToday(currentDate);
          const isSelected = selectedDayNumber === dayNumber;
          const status = getDayStatus(dayNumber);
          const progress = getProgressPercentage(dayNumber);
          
          return (
            <Button
              key={dayNumber}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDayNumber(dayNumber)}
              className={`relative h-16 p-2 flex flex-col items-center justify-center text-xs transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-md scale-105' 
                  : isDayToday 
                  ? 'border-blue-300 bg-blue-50 text-blue-700' 
                  : 'hover:bg-gray-50'
              } ${isRTL ? 'flex-col-reverse' : ''}`}
            >
              {/* Day Name & Date */}
              <div className={`flex flex-col items-center ${isRTL ? 'flex-col-reverse' : ''}`}>
                <span className="font-medium text-xs">{day}</span>
                <span className="text-xs font-bold">{format(currentDate, 'd')}</span>
              </div>
              
              {/* Status Indicator */}
              <div className="absolute -top-1 -right-1 flex items-center gap-1">
                {isDayToday && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
                {status === 'completed' && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {status === 'rest' && (
                  <Moon className="w-3 h-3 text-blue-500" />
                )}
                {status === 'workout' && !getDayWorkout(dayNumber)?.completed && (
                  <Dumbbell className="w-3 h-3 text-gray-400" />
                )}
              </div>

              {/* Progress Bar for Active Workouts */}
              {status === 'workout' && progress > 0 && progress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b">
                  <div 
                    className="h-full bg-blue-500 rounded-b transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className={`flex items-center justify-center gap-4 mt-3 text-xs text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full" />
          <span>{t('common.today')}</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span>{t('exercise.completed')}</span>
        </div>
        <div className="flex items-center gap-1">
          <Moon className="w-3 h-3 text-blue-500" />
          <span>{t('exercise.rest')}</span>
        </div>
      </div>
    </Card>
  );
};
