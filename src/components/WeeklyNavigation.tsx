
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
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
    <Card className="mb-6 p-5 bg-gradient-to-br from-white to-health-soft border-2 border-health-border-light shadow-health rounded-2xl backdrop-blur-sm">
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Button
          variant="outline"
          onClick={() => onWeekChange(currentWeekOffset - 1)}
          className="bg-white/90 hover:bg-health-soft-blue border-2 border-health-border hover:border-health-primary text-health-text-primary hover:text-health-primary font-medium px-4 py-2 rounded-xl shadow-soft hover:shadow-health transform hover:scale-105 transition-all duration-300"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('mealPlan.previousWeek')}
        </Button>

        <div className="text-center px-4">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-health-gradient rounded-lg flex items-center justify-center mr-3 shadow-soft">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-health-text-primary">
              {formatWeekRange(weekStartDate)}
            </h3>
          </div>
          <p className="text-sm text-health-text-secondary font-medium bg-health-soft px-3 py-1 rounded-lg inline-block">
            {getWeekStatus(currentWeekOffset)}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => onWeekChange(currentWeekOffset + 1)}
          className="bg-white/90 hover:bg-health-soft-blue border-2 border-health-border hover:border-health-primary text-health-text-primary hover:text-health-primary font-medium px-4 py-2 rounded-xl shadow-soft hover:shadow-health transform hover:scale-105 transition-all duration-300"
          size="sm"
        >
          {t('mealPlan.nextWeek')}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default WeeklyNavigation;
