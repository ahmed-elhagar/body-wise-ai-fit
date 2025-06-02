
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeekNavigationProps {
  currentWeekOffset: number;
  onWeekOffsetChange: (offset: number) => void;
  weekStartDate: Date;
}

export const WeekNavigation = ({ 
  currentWeekOffset, 
  onWeekOffsetChange, 
  weekStartDate 
}: WeekNavigationProps) => {
  const { isRTL } = useLanguage();

  const getWeekDateRange = () => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    return `${weekStartDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  return (
    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onWeekOffsetChange(currentWeekOffset - 1)}
        className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="text-center min-w-[180px]">
        <div className="text-sm font-medium text-gray-700 bg-gray-50 rounded-lg px-4 py-2">
          {getWeekDateRange()}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onWeekOffsetChange(currentWeekOffset + 1)}
        className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
