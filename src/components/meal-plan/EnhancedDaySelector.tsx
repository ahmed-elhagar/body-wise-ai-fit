
import { format, addDays, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid3X3, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useMealPlanTranslations } from "@/utils/mealPlanTranslations";

interface EnhancedDaySelectorProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  dailyMealsCount?: number;
}

const EnhancedDaySelector = ({
  weekStartDate,
  selectedDayNumber,
  onDayChange,
  viewMode,
  onViewModeChange,
  currentWeekOffset,
  onWeekChange,
  dailyMealsCount = 0
}: EnhancedDaySelectorProps) => {
  const { 
    currentWeek, 
    selectDay, 
    dailyView, 
    weeklyView, 
    meals,
    today,
    isRTL 
  } = useMealPlanTranslations();
  
  const todayDate = new Date();

  const days = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const date = addDays(weekStartDate, index);
    const isSelected = selectedDayNumber === dayNumber;
    const isToday = isSameDay(date, todayDate);
    
    return {
      dayNumber,
      date,
      isSelected,
      isToday,
      dayDate: format(date, 'd')
    };
  });

  const isCurrentWeek = currentWeekOffset === 0;
  const weekEndDate = addDays(weekStartDate, 6);

  const formatWeekRange = (startDate: Date, endDate: Date) => {
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  console.log('🎯 EnhancedDaySelector - Current view mode:', viewMode);

  return (
    <Card className="bg-gradient-to-r from-fitness-primary-50 via-white to-fitness-accent-50 border-fitness-primary-200 shadow-lg rounded-2xl">
      <div className="p-6">
        {/* Top Row: Week Navigation + View Mode Toggle */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Week Navigation */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-10 w-10 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50 rounded-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className={`text-center min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-lg font-bold text-fitness-primary-800">
                  {formatWeekRange(weekStartDate, weekEndDate)}
                </h2>
                {isCurrentWeek && (
                  <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 text-xs px-2 py-1">
                    {currentWeek}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-fitness-primary-600 mt-1">
                {viewMode === 'daily' ? dailyView : weeklyView}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-10 w-10 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50 rounded-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* View Mode Toggle - ENHANCED WITH CLEAR ICONS */}
          <div className="flex bg-white rounded-xl p-1 border-2 border-fitness-primary-200 shadow-md">
            <button
              onClick={() => {
                console.log('🎯 Switching to daily view');
                onViewModeChange('daily');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm min-w-[100px] justify-center ${
                viewMode === 'daily'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{dailyView}</span>
            </button>
            <button
              onClick={() => {
                console.log('🎯 Switching to weekly view');
                onViewModeChange('weekly');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm min-w-[100px] justify-center ${
                viewMode === 'weekly'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>{weeklyView}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Day Selector (only show in daily view) */}
        {viewMode === 'daily' && (
          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Eye className="w-5 h-5 text-fitness-primary-600" />
              <h3 className="text-lg font-semibold text-fitness-primary-800">
                {selectDay}
              </h3>
              {dailyMealsCount > 0 && (
                <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200">
                  {dailyMealsCount} {meals}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {days.map(({ dayNumber, date, isSelected, isToday, dayDate }) => (
                <button
                  key={dayNumber}
                  onClick={() => onDayChange(dayNumber)}
                  className={`
                    relative p-3 rounded-xl font-medium transition-all duration-300 text-center group
                    ${isSelected 
                      ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105 z-10' 
                      : 'bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 shadow-sm border-2 border-fitness-primary-100 hover:border-fitness-primary-200'
                    }
                    ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-300 ring-offset-2' : ''}
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-fitness-primary-700'}`}>
                      {dayDate}
                    </span>
                    {isToday && (
                      <div className="flex flex-col items-center">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                        <span className={`text-xs font-medium mt-1 ${isSelected ? 'text-fitness-accent-200' : 'text-fitness-accent-600'}`}>
                          {today}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Weekly View Indicator */}
        {viewMode === 'weekly' && (
          <div className="text-center py-4">
            <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Grid3X3 className="w-5 h-5 text-fitness-primary-600" />
              <h3 className="text-lg font-semibold text-fitness-primary-800">
                {weeklyView}
              </h3>
            </div>
            <p className="text-sm text-fitness-primary-600 mt-1">
              Viewing all 7 days of the week
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedDaySelector;
