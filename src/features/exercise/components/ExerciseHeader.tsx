
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Home, Building2, Dumbbell, Sparkles, RotateCcw } from "lucide-react";
import { format, addDays } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseHeaderProps {
  currentProgram: any;
  weekStartDate: Date;
  currentWeekOffset: number;
  workoutType: "home" | "gym";
  onWeekChange: (offset: number) => void;
  onShowAIDialog: () => void;
  onRegenerateProgram: () => void;
  onWorkoutTypeChange: (type: "home" | "gym") => void;
  isGenerating: boolean;
}

export const ExerciseHeader = ({
  currentProgram,
  weekStartDate,
  currentWeekOffset,
  workoutType,
  onWeekChange,
  onShowAIDialog,
  onRegenerateProgram,
  onWorkoutTypeChange,
  isGenerating
}: ExerciseHeaderProps) => {
  const { t, isRTL } = useLanguage();

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

  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <Card className="p-4 bg-white shadow-sm border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left - Week Navigation */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0 || isGenerating}
            className="h-9 w-9 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className={`text-center min-w-[100px] ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="text-sm font-semibold text-gray-900">
              {isCurrentWeek ? t('common.thisWeek') : `${t('exercise.week')} ${currentWeekOffset + 1}`}
            </div>
            <div className="text-xs text-gray-600">
              {formatWeekRange(weekStartDate)}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            disabled={currentWeekOffset >= 3 || isGenerating}
            className="h-9 w-9 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Center - Program Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">{t('exercise.exerciseProgram')}</h1>
            {currentProgram && (
              <div className="text-xs text-gray-600">
                {currentProgram.goal_type?.replace('_', ' ') || t('exercise.general_fitness')}
              </div>
            )}
          </div>
        </div>

        {/* Right - Workout Type & Actions */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Workout Type Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={workoutType === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => onWorkoutTypeChange("home")}
              disabled={isGenerating}
              className={`h-8 px-3 text-xs ${
                workoutType === "home" 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('exercise.home')}
            </Button>
            
            <Button
              variant={workoutType === "gym" ? "default" : "ghost"}
              size="sm"
              onClick={() => onWorkoutTypeChange("gym")}
              disabled={isGenerating}
              className={`h-8 px-3 text-xs ${
                workoutType === "gym" 
                  ? "bg-purple-600 text-white shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t('exercise.gym')}
            </Button>
          </div>

          {/* AI Actions */}
          <Button
            onClick={onShowAIDialog}
            size="sm"
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Sparkles className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {t('exercise.generateAI')}
          </Button>
        </div>
      </div>
    </Card>
  );
};
