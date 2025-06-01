
import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Grid2X2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
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
    <Card className="bg-gradient-to-r from-fitness-primary-50 via-white to-fitness-accent-50 border-fitness-primary-200 shadow-xl">
      <div className="p-6">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Enhanced Week Navigation */}
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset - 1)}
              className="h-11 w-11 p-0 border-2 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50 hover:border-fitness-primary-400 shadow-lg rounded-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center bg-white/80 px-6 py-3 rounded-xl border border-fitness-primary-200 shadow-sm">
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Eye className="w-5 h-5 text-fitness-primary-600" />
                <div>
                  <h2 className="text-lg font-bold text-fitness-primary-800">
                    {formatWeekRange(weekStartDate, weekEndDate)}
                  </h2>
                  {isCurrentWeek && (
                    <Badge className="bg-fitness-accent-100 text-fitness-accent-700 border-fitness-accent-200 text-xs mt-1">
                      {currentWeek}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onWeekChange(currentWeekOffset + 1)}
              className="h-11 w-11 p-0 border-2 border-fitness-primary-300 text-fitness-primary-600 hover:bg-fitness-primary-50 hover:border-fitness-primary-400 shadow-lg rounded-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Enhanced View Mode Toggle */}
          <div className="flex bg-white rounded-2xl p-2 border-2 border-fitness-primary-200 shadow-xl">
            <button
              onClick={() => onViewModeChange('daily')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all text-sm ${
                viewMode === 'daily'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>{dailyView}</span>
            </button>
            <button
              onClick={() => onViewModeChange('weekly')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all text-sm ${
                viewMode === 'weekly'
                  ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105'
                  : 'text-fitness-primary-600 hover:text-fitness-primary-700 hover:bg-fitness-primary-50'
              }`}
            >
              <Grid2X2 className="w-5 h-5" />
              <span>{weeklyView}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ViewModeSelector;
