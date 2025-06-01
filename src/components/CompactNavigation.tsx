
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import { format, addDays } from "date-fns";

interface CompactNavigationProps {
  currentWeekOffset: number;
  setCurrentWeekOffset?: (offset: number) => void;
  onWeekChange?: (offset: number) => void;
  weekStartDate: Date;
  selectedDayNumber?: number;
  onDaySelect?: (day: number) => void;
  viewMode?: 'daily' | 'weekly';
  onViewModeChange?: (mode: 'daily' | 'weekly') => void;
}

const CompactNavigation = ({
  currentWeekOffset,
  setCurrentWeekOffset,
  onWeekChange,
  weekStartDate,
  selectedDayNumber,
  onDaySelect,
  viewMode,
  onViewModeChange
}: CompactNavigationProps) => {
  const { t, isRTL } = useI18n();

  const formatWeekRange = (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  const handleWeekChange = (newOffset: number) => {
    if (setCurrentWeekOffset) {
      setCurrentWeekOffset(newOffset);
    }
    if (onWeekChange) {
      onWeekChange(newOffset);
    }
  };

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleWeekChange(Math.max(0, currentWeekOffset - 1))}
          disabled={currentWeekOffset === 0}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="text-center">
          <h3 className="font-semibold text-gray-800">
            {t('Week')} {currentWeekOffset + 1}
          </h3>
          <p className="text-sm text-gray-600">
            {formatWeekRange(weekStartDate)}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleWeekChange(currentWeekOffset + 1)}
          disabled={currentWeekOffset >= 3}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CompactNavigation;
