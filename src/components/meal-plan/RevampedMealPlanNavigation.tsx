
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
    <div className="space-y-4">
      {/* Week Navigation Header */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-10 w-10 p-0 border-fitness-primary-300 hover:bg-fitness-primary-100 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-fitness-primary-600" />
            </Button>
            
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-2 text-fitness-primary-900">
                <Calendar className="w-5 h-5" />
                <h3 className="text-lg font-bold">
                  {formatWeekRange(weekStartDate)}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                {isCurrentWeek ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Current Week
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-fitness-primary-300 text-fitness-primary-600">
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
              className="h-10 w-10 p-0 border-fitness-primary-300 hover:bg-fitness-primary-100 shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-fitness-primary-600" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Day Selector */}
      <Card className="bg-white/95 backdrop-blur-sm border-fitness-primary-200 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-7 divide-x divide-fitness-primary-100">
            {days.map(({ dayNumber, date, isSelected, isToday, shortDay, dayDate, monthDay }) => (
              <button
                key={dayNumber}
                onClick={() => onDayChange(dayNumber)}
                className={`
                  relative flex flex-col items-center py-4 px-2 transition-all duration-300 hover:bg-fitness-primary-50
                  ${isSelected 
                    ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105 z-10' 
                    : 'bg-white hover:bg-fitness-primary-50'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-inset ring-fitness-accent-400' : ''}
                `}
              >
                {/* Day Name */}
                <span className={`text-xs font-semibold mb-1 ${
                  isSelected ? 'text-white' : 'text-fitness-primary-500'
                }`}>
                  {shortDay}
                </span>
                
                {/* Day Number */}
                <span className={`text-2xl font-bold mb-1 ${
                  isSelected ? 'text-white' : 'text-fitness-primary-700'
                }`}>
                  {dayDate}
                </span>
                
                {/* Month Day for mobile */}
                <span className={`text-xs ${
                  isSelected ? 'text-fitness-primary-100' : 'text-fitness-primary-400'
                } hidden sm:block`}>
                  {format(date, 'MMM')}
                </span>
                
                {/* Today Indicator */}
                {isToday && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
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
