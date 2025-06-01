
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid2X2, ChevronLeft, ChevronRight } from "lucide-react";
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
    <Card className="bg-gradient-to-r from-fitness-primary-50 via-white to-fitness-accent-50 border-fitness-primary-200 shadow-lg">
      <div className="p-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Week Navigation */}
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-9 w-9 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h2 className="text-base font-bold text-fitness-primary-800">
                  {formatWeekRange(weekStartDate, weekEndDate)}
                </h2>
                {isCurrentWeek && (
                  <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 text-xs">
                    {currentWeek}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-9 w-9 p-0 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl p-1 border-2 border-fitness-primary-200 shadow-md">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'daily'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{dailyView}</span>
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                viewMode === 'weekly'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Grid2X2 className="w-4 h-4" />
              <span>{weeklyView}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ViewModeSelector;
