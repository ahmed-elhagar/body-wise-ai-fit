
import React from 'react';
import { MealPlanViewToggle } from './MealPlanViewToggle';
import { WeekNavigation } from './WeekNavigation';
import { DaySelector } from './DaySelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface MealPlanNavigationProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  currentWeekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
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
  const { isRTL } = useLanguage();

  if (!hasWeeklyPlan) return null;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      {/* Top Row: View Mode Toggle and Week Navigation */}
      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <MealPlanViewToggle 
          viewMode={viewMode} 
          onViewModeChange={onViewModeChange} 
        />
        <WeekNavigation 
          currentWeekOffset={currentWeekOffset}
          onWeekOffsetChange={onWeekOffsetChange}
          weekStartDate={weekStartDate}
        />
      </div>

      {/* Day Selection (Daily View Only) */}
      {viewMode === 'daily' && (
        <DaySelector 
          selectedDayNumber={selectedDayNumber}
          onDayChange={onDayChange}
          weekStartDate={weekStartDate}
        />
      )}
    </div>
  );
};
