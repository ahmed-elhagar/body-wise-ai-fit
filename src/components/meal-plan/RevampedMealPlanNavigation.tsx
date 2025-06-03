
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { format, addDays, isSameDay } from 'date-fns';
import { formatWeekRange, getDayName } from '@/utils/mealPlanUtils';

interface RevampedMealPlanNavigationProps {
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
}

export const RevampedMealPlanNavigation = ({
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  selectedDayNumber,
  onDayChange
}: RevampedMealPlanNavigationProps) => {
  const today = new Date();
  const isCurrentWeek = currentWeekOffset === 0;

  const days = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const date = addDays(weekStartDate, index);
    const isSelected = selectedDayNumber === dayNumber;
    const isToday = isSameDay(date, today);
    
    return {
      dayNumber,
      date,
      isSelected,
      isToday,
      dayName: getDayName(dayNumber),
      shortDay: getDayName(dayNumber).slice(0, 3),
      dayDate: format(date, 'd'),
      monthDay: format(date, 'MMM d')
    };
  });

  return (
    <div className="space-y-3">
      {/* Compact Week Navigation Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 shadow-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-8 w-8 p-0 border-fitness-primary-300 hover:bg-fitness-primary-100"
            >
              <ChevronLeft className="w-4 h-4 text-fitness-primary-600" />
            </Button>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-fitness-primary-900">
                <Calendar className="w-4 h-4" />
                <h3 className="text-base font-semibold">
                  {formatWeekRange(weekStartDate)}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                {isCurrentWeek ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs px-2 py-0.5">
                    <Clock className="w-3 h-3 mr-1" />
                    Current Week
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-fitness-primary-300 text-fitness-primary-600 text-xs px-2 py-0.5">
                    {currentWeekOffset > 0 ? `${currentWeekOffset} week${currentWeekOffset > 1 ? 's' : ''} ahead` :
                     `${Math.abs(currentWeekOffset)} week${Math.abs(currentWeekOffset) > 1 ? 's' : ''} ago`}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-8 w-8 p-0 border-fitness-primary-300 hover:bg-fitness-primary-100"
            >
              <ChevronRight className="w-4 h-4 text-fitness-primary-600" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compact Day Selector */}
      <Card className="bg-white/95 backdrop-blur-sm border-fitness-primary-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 divide-x divide-fitness-primary-100">
            {days.map(({ dayNumber, date, isSelected, isToday, shortDay, dayDate, monthDay }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  relative flex flex-col items-center py-3 px-2 transition-all duration-200 hover:bg-fitness-primary-50
                  ${isSelected 
                    ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-md transform scale-105 z-10' 
                    : 'bg-white hover:bg-fitness-primary-50'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-inset ring-fitness-accent-400' : ''}
                `}
              >
                {/* Day Name */}
                <span className={`text-xs font-medium mb-1 ${
                  isSelected ? 'text-white' : 'text-fitness-primary-500'
                }`}>
                  {shortDay}
                </span>
                
                {/* Day Number */}
                <span className={`text-lg font-bold ${
                  isSelected ? 'text-white' : 'text-fitness-primary-700'
                }`}>
                  {dayDate}
                </span>
                
                {/* Today Indicator */}
                {isToday && (
                  <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                    isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'
                  } shadow-sm`} />
                )}
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary-500/20 to-fitness-primary-600/20 rounded-none" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
