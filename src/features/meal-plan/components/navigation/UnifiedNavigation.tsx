
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
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
  isGenerating: boolean;
  hasWeeklyPlan: boolean;
  remainingCredits?: number;
}

export const UnifiedNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  selectedDayNumber,
  setSelectedDayNumber,
  weekStartDate,
  onGenerateAI,
  isGenerating,
  hasWeeklyPlan,
  remainingCredits = 0
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
        className={`flex flex-col gap-1 h-16 relative ${isRTL ? 'flex-row-reverse' : ''} ${
          isSelected ? 'bg-fitness-primary-600 hover:bg-fitness-primary-700' : 'hover:bg-fitness-primary-50'
        }`}
      >
        <span className="text-xs font-medium">
          {getDayName(dayNumber).slice(0, 3)}
        </span>
        <span className="text-xs">
          {format(dayDate, 'd')}
        </span>
        {isToday && (
          <Badge variant="secondary" className="absolute -top-1 -right-1 text-xs px-1 bg-orange-500 text-white">
            {today}
          </Badge>
        )}
      </Button>
    );
  });

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <Card className="bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50 border-fitness-primary-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
                className="border-fitness-primary-300 hover:bg-fitness-primary-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                <div className="font-semibold flex items-center gap-2 text-fitness-primary-900">
                  <Calendar className="w-4 h-4" />
                  {format(weekStartDate, 'MMM d')} - {format(weekEndDate, 'MMM d, yyyy')}
                </div>
                {isCurrentWeek && (
                  <Badge variant="secondary" className="text-xs mt-1 bg-fitness-primary-100 text-fitness-primary-700">
                    {currentWeek}
                  </Badge>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
                className="border-fitness-primary-300 hover:bg-fitness-primary-100"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {/* Credits Display */}
              <div className="flex items-center gap-2 text-sm bg-white/80 px-3 py-1 rounded-lg border border-fitness-primary-200">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-fitness-primary-700">{aiCredits}: {remainingCredits}</span>
              </div>

              {/* Generate AI Button */}
              <Button
                onClick={onGenerateAI}
                size="sm"
                disabled={isGenerating || remainingCredits <= 0}
                className="bg-gradient-to-r from-fitness-primary-600 to-fitness-accent-600 hover:from-fitness-primary-700 hover:to-fitness-accent-700 text-white shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : generateAIMealPlan}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selection */}
      {hasWeeklyPlan && (
        <Card className="bg-white/80 backdrop-blur-sm border-fitness-primary-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-medium text-center text-fitness-primary-900">{selectDay}</h3>
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
