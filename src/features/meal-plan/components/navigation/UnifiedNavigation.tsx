
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RefreshCw,
  Calendar,
  Coins
} from "lucide-react";
import { format, addDays } from 'date-fns';
import { useMealPlanTranslations } from '@/utils/mealPlanTranslations';
import { getDayName } from '@/utils/mealPlanUtils';

interface UnifiedNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  weekStartDate: Date;
  onGenerateAI: () => void;
  onRefresh: () => void;
  hasWeeklyPlan: boolean;
  credits: { remaining: number };
}

export const UnifiedNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  selectedDayNumber,
  setSelectedDayNumber,
  weekStartDate,
  onGenerateAI,
  onRefresh,
  hasWeeklyPlan,
  credits
}: UnifiedNavigationProps) => {
  const {
    currentWeek,
    generateAIMealPlan,
    aiCredits,
    selectDay,
    today,
    language,
    isRTL
  } = useMealPlanTranslations();

  const weekEndDate = addDays(weekStartDate, 6);
  const isCurrentWeek = currentWeekOffset === 0;

  const dayButtons = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const dayDate = addDays(weekStartDate, index);
    const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    const isSelected = dayNumber === selectedDayNumber;

    return (
      <Button
        key={dayNumber}
        variant={isSelected ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedDayNumber(dayNumber)}
        className={`flex flex-col gap-1 h-16 relative ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <span className="text-xs font-medium">
          {getDayName(dayNumber).slice(0, 3)}
        </span>
        <span className="text-xs text-gray-600">
          {format(dayDate, 'd')}
        </span>
        {isToday && (
          <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1">
            {today}
          </Badge>
        )}
      </Button>
    );
  });

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <div className="font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d, yyyy')}
                </div>
                {isCurrentWeek && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {currentWeek}
                  </Badge>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {/* Credits Display */}
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{aiCredits}: {credits.remaining}</span>
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              
              <Button
                onClick={onGenerateAI}
                size="sm"
                disabled={credits.remaining <= 0}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generateAIMealPlan}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selection */}
      {hasWeeklyPlan && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-medium text-center">{selectDay}</h3>
              <div className={`grid grid-cols-7 gap-2 ${isRTL ? 'direction-rtl' : ''}`}>
                {dayButtons}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
