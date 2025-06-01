
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid3X3, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useMealPlanTranslations } from "@/utils/mealPlanTranslations";

interface ViewModeSelectorProps {
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  weekStartDate: Date;
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
}

const ViewModeSelector = ({
  viewMode,
  onViewModeChange,
  weekStartDate,
  currentWeekOffset,
  onWeekChange
}: ViewModeSelectorProps) => {
  const { currentWeek, dailyView, weeklyView, isRTL } = useMealPlanTranslations();
  
  const isCurrentWeek = currentWeekOffset === 0;
  const weekEndDate = addDays(weekStartDate, 6);

  const formatWeekRange = (startDate: Date, endDate: Date) => {
    if (startDate.getMonth() === endDate.getMonth()) {
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
    }
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  return (
    <Card className="bg-white border-fitness-primary-100 shadow-sm rounded-xl">
      <div className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Week Navigation - Left Side */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-9 w-9 p-0 border-fitness-primary-200 text-fitness-primary-600 hover:bg-fitness-primary-50 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <h3 className="text-lg font-bold text-fitness-primary-800">
                {formatWeekRange(weekStartDate, weekEndDate)}
              </h3>
              {isCurrentWeek && (
                <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 text-xs mt-1">
                  {currentWeek || 'Current Week'}
                </Badge>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-9 w-9 p-0 border-fitness-primary-200 text-fitness-primary-600 hover:bg-fitness-primary-50 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode Toggle - Right Side */}
          <div className="flex bg-fitness-primary-50 rounded-xl p-1.5 border border-fitness-primary-200">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'daily'
                  ? 'bg-white text-fitness-primary-700 shadow-sm border border-fitness-primary-200'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{dailyView || 'Daily'}</span>
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'weekly'
                  ? 'bg-white text-fitness-primary-700 shadow-sm border border-fitness-primary-200'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-100'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>{weeklyView || 'Weekly'}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ViewModeSelector;
