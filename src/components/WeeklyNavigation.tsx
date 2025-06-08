
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface WeeklyNavigationProps {
  currentWeekOffset: number;
  onWeekChange: (offset: number) => void;
  weekDateRange: string;
}

const WeeklyNavigation = ({ currentWeekOffset, onWeekChange, weekDateRange }: WeeklyNavigationProps) => {
  const { t, isRTL } = useI18n();

  return (
    <div className={`flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onWeekChange(currentWeekOffset - 1)}
        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        {t('common:previousWeek')}
      </Button>

      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Calendar className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-800">{weekDateRange}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onWeekChange(currentWeekOffset + 1)}
        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {t('common:nextWeek')}
        {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default WeeklyNavigation;
