
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatWeekRange, getDayName } from "@/utils/mealPlanUtils";
import { useMealPlanTranslations } from "@/hooks/useMealPlanTranslations";

interface MealPlanNavigationProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  currentWeekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
  selectedDayNumber: number;
  onDayChange: (day: number) => void;
  weekStartDate: Date;
  hasWeeklyPlan: boolean;
}

export const MealPlanNavigation = ({
  viewMode,
  onViewModeChange,
  currentWeekOffset,
  onWeekOffsetChange,
  selectedDayNumber,
  onDayChange,
  weekStartDate,
  hasWeeklyPlan
}: MealPlanNavigationProps) => {
  const { currentWeek, dailyView, weeklyView, today } = useMealPlanTranslations();

  const today_day = new Date().getDay() === 6 ? 1 : new Date().getDay() + 2;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekOffsetChange(currentWeekOffset - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <div className="font-semibold text-gray-800">
                {formatWeekRange(weekStartDate)}
              </div>
              {currentWeekOffset === 0 && (
                <Badge variant="secondary" className="text-xs">
                  {currentWeek}
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekOffsetChange(currentWeekOffset + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('daily')}
              className="text-sm"
            >
              {dailyView}
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('weekly')}
              className="text-sm"
            >
              {weeklyView}
            </Button>
          </div>
        </div>

        {/* Day Navigation (for daily view) */}
        {viewMode === 'daily' && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => (
              <Button
                key={dayNumber}
                variant={selectedDayNumber === dayNumber ? 'default' : 'outline'}
                size="sm"
                onClick={() => onDayChange(dayNumber)}
                className={`min-w-[80px] text-xs ${
                  dayNumber === today_day && currentWeekOffset === 0 
                    ? 'ring-2 ring-fitness-accent-400' 
                    : ''
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{getDayName(dayNumber)}</div>
                  {dayNumber === today_day && currentWeekOffset === 0 && (
                    <div className="text-xs text-fitness-accent-600">{today}</div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
