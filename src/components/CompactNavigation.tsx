
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, Grid } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getDayNames } from "@/utils/mealPlanUtils";

interface CompactNavigationProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber: number;
  onDaySelect: (dayNumber: number) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
}

const CompactNavigation = ({
  currentWeekOffset,
  onWeekChange,
  weekStartDate,
  selectedDayNumber,
  onDaySelect,
  viewMode,
  onViewModeChange
}: CompactNavigationProps) => {
  const { t, isRTL } = useLanguage();
  const dayNames = getDayNames(t);
  const shortDayNames = ['S', 'S', 'M', 'T', 'W', 'T', 'F'];

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const endDay = endDate.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  return (
    <Card className="p-3 bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <div className="space-y-3">
        {/* Week Navigation Row */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-center">
            <div className="text-sm font-semibold text-gray-800">
              {formatWeekRange(weekStartDate)}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* View Toggle and Day Selector Row */}
        <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* View Toggle */}
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-3 text-xs ${
                viewMode === 'daily' 
                  ? 'bg-fitness-gradient text-white shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => onViewModeChange('daily')}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {t('mealPlan.dailyView')}
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              className={`h-7 px-3 text-xs ${
                viewMode === 'weekly' 
                  ? 'bg-fitness-gradient text-white shadow-sm' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => onViewModeChange('weekly')}
            >
              <Grid className="w-3 h-3 mr-1" />
              {t('mealPlan.weeklyView')}
            </Button>
          </div>

          {/* Day Selector - Only show in daily view */}
          {viewMode === 'daily' && (
            <div className="flex gap-1">
              {shortDayNames.map((day, index) => (
                <Button
                  key={index}
                  variant={selectedDayNumber === index + 1 ? "default" : "outline"}
                  size="sm"
                  className={`h-7 w-7 p-0 text-xs ${
                    selectedDayNumber === index + 1 
                      ? 'bg-fitness-gradient text-white shadow-sm' 
                      : 'bg-white/80 hover:bg-gray-50 text-gray-600'
                  }`}
                  onClick={() => onDaySelect(index + 1)}
                >
                  {day}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CompactNavigation;
