import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

interface WeeklyNavigationProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
  totalWeeks: number;
}

const WeeklyNavigation = ({ currentWeek, onWeekChange, totalWeeks }: WeeklyNavigationProps) => {
  const { t, isRTL } = useI18n();

  const handlePreviousWeek = () => {
    onWeekChange(currentWeek - 1);
  };

  const handleNextWeek = () => {
    onWeekChange(currentWeek + 1);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handlePreviousWeek} disabled={currentWeek === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('previousWeek')}
        </Button>
        <div className="text-center">
          {t('week')} {currentWeek} / {totalWeeks}
        </div>
        <Button variant="ghost" size="sm" onClick={handleNextWeek} disabled={currentWeek === totalWeeks}>
          {t('nextWeek')}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default WeeklyNavigation;
