
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatWeekRange, getDayName } from '@/utils/mealPlanUtils';
import { MealPlanViewToggle } from './MealPlanViewToggle';
import type { ViewMode } from '@/types/mealPlan';

interface MealPlanNavigationProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  selectedDayNumber: number;
  onDayChange: (day: number) => void;
}

const MealPlanNavigation = ({
  viewMode,
  onViewModeChange,
  weekStartDate,
  currentWeekOffset,
  onWeekChange,
  selectedDayNumber,
  onDayChange
}: MealPlanNavigationProps) => {
  return (
    <Card className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="h-10 w-10 p-0 border-gray-300"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900">
              {formatWeekRange(weekStartDate)}
            </h3>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="h-10 w-10 p-0 border-gray-300"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <MealPlanViewToggle 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
      
      {/* Days Navigation */}
      <div className="grid grid-cols-7 gap-1">
        {[1, 2, 3, 4, 5, 6, 7].map((dayNumber) => {
          const isSelected = selectedDayNumber === dayNumber;
          const dayName = getDayName(dayNumber);
          
          return (
            <Button
              key={dayNumber}
              variant="ghost"
              className={`h-14 p-2 rounded-xl transition-all duration-200 ${
                isSelected 
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg scale-105 border-0' 
                  : 'bg-gray-50/80 hover:bg-gray-100/80 text-gray-700 hover:text-gray-900 border border-gray-200/50'
              }`}
              onClick={() => onDayChange(dayNumber)}
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <span className={`text-xs font-medium ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                  {dayName.slice(0, 3)}
                </span>
                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {dayName}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default MealPlanNavigation;
