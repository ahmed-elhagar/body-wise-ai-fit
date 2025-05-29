
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeeklyNavigationProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  weekStartDate: Date;
}

const WeeklyNavigation = ({ currentWeekOffset, onWeekChange, weekStartDate }: WeeklyNavigationProps) => {
  const { t, isRTL } = useLanguage();

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const startDay = startDate.getDate();
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    const endDay = endDate.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  };

  const getWeekStatus = (offset: number) => {
    if (offset === 0) return t('mealPlan.thisWeek');
    if (offset === -1) return t('mealPlan.lastWeek');
    if (offset === 1) return t('mealPlan.nextWeek');
    if (offset < 0) return `${Math.abs(offset)} ${t('mealPlan.weeksAgo')}`;
    return `${offset} ${t('mealPlan.weeksAhead')}`;
  };

  return (
    <Card className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          onClick={() => onWeekChange(currentWeekOffset - 1)}
          className="bg-white/80 text-sm sm:text-base"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('mealPlan.previousWeek')}
        </Button>

        <div className="text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {formatWeekRange(weekStartDate)}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">{getWeekStatus(currentWeekOffset)}</p>
        </div>

        <Button
          variant="outline"
          onClick={() => onWeekChange(currentWeekOffset + 1)}
          className="bg-white/80 text-sm sm:text-base"
          size="sm"
        >
          {t('mealPlan.nextWeek')}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};

export default WeeklyNavigation;
