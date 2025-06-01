
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, Grid, Menu } from "lucide-react";
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
  
  // Enhanced short day names for better mobile experience
  const shortDayNames = isRTL 
    ? ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'] // Arabic short day names
    : ['SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI'];

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { month: 'short' });
    const endDay = endDate.getDate();
    
    if (startMonth === endMonth) {
      return isRTL ? `${endDay}-${startDay} ${startMonth}` : `${startMonth} ${startDay}-${endDay}`;
    } else {
      return isRTL ? `${endDay} ${endMonth} - ${startDay} ${startMonth}` : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  return (
    <Card className="p-3 bg-white/98 backdrop-blur-md border-0 shadow-lg sticky top-0 z-20">
      <div className={`space-y-3 ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Enhanced Week Navigation Row */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset - 1)}
            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-xl shadow-sm transition-colors"
            aria-label={t('previousWeek')}
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          <div className="text-center flex-1 px-4">
            <div className="text-sm font-bold text-gray-800 mb-1">
              {formatWeekRange(weekStartDate)}
            </div>
            <div className="text-xs text-gray-500">
              {currentWeekOffset === 0 ? t('thisWeek') : 
               currentWeekOffset > 0 ? t('futureWeek') : t('pastWeek')}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWeekChange(currentWeekOffset + 1)}
            className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-xl shadow-sm transition-colors"
            aria-label={t('nextWeek')}
          >
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Enhanced View Toggle and Day Selector Row */}
        <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Improved View Toggle */}
          <div className="bg-gray-100 rounded-xl p-1 flex shadow-inner">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'ghost'}
              size="sm"
              className={`h-8 px-3 text-xs rounded-lg transition-all duration-200 ${
                viewMode === 'daily' 
                  ? 'bg-blue-500 text-white shadow-md font-semibold hover:bg-blue-600' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => onViewModeChange('daily')}
              aria-pressed={viewMode === 'daily'}
            >
              <Calendar className="w-3 h-3" />
              <span className={`hidden sm:inline ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t('mealPlan.dailyView')}
              </span>
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              className={`h-8 px-3 text-xs rounded-lg transition-all duration-200 ${
                viewMode === 'weekly' 
                  ? 'bg-blue-500 text-white shadow-md font-semibold hover:bg-blue-600' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}
              onClick={() => onViewModeChange('weekly')}
              aria-pressed={viewMode === 'weekly'}
            >
              <Grid className="w-3 h-3" />
              <span className={`hidden sm:inline ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t('mealPlan.weeklyView')}
              </span>
            </Button>
          </div>

          {/* Enhanced Day Selector - Only show in daily view */}
          {viewMode === 'daily' && (
            <div 
              className={`flex gap-1 bg-gray-50 p-1 rounded-xl shadow-inner ${isRTL ? 'flex-row-reverse' : ''}`}
              role="tablist"
              aria-label={t('selectDay')}
            >
              {shortDayNames.map((day, index) => {
                const dayNumber = index + 1;
                const isSelected = selectedDayNumber === dayNumber;
                const isToday = new Date().getDay() === (index + 6) % 7; // Adjust for Saturday start
                
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-10 p-0 text-xs font-medium rounded-lg transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-500 text-white shadow-md scale-105 hover:bg-blue-600' 
                        : 'hover:bg-gray-100 text-gray-600'
                    } ${isToday ? 'ring-2 ring-blue-300' : ''}`}
                    onClick={() => onDaySelect(dayNumber)}
                    aria-pressed={isSelected}
                    aria-label={`${dayNames[index]} ${isToday ? '(Today)' : ''}`}
                    role="tab"
                  >
                    {day}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CompactNavigation;
