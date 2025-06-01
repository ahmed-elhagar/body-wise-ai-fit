
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/useI18n";
import { getDayNames } from "@/utils/mealPlanUtils";

interface DaySelectorProps {
  selectedDayNumber: number;
  onDaySelect: (dayNumber: number) => void;
}

const DaySelector = ({ selectedDayNumber, onDaySelect }: DaySelectorProps) => {
  const { t, isRTL } = useI18n();
  const dayNames = getDayNames(t);
  const shortDayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <Card className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className={`flex items-center justify-between mb-3 sm:mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          {t('mealPlan.selectDay')}
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {shortDayNames.map((day, index) => (
          <Button
            key={day}
            variant={selectedDayNumber === index + 1 ? "default" : "outline"}
            className={`text-xs sm:text-sm py-2 sm:py-3 ${
              selectedDayNumber === index + 1 
                ? 'bg-fitness-gradient text-white shadow-lg' 
                : 'bg-white/80 hover:bg-gray-50'
            }`}
            onClick={() => onDaySelect(index + 1)}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium">{day}</span>
              <span className="text-xs opacity-75 hidden sm:block">
                {dayNames[index]}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default DaySelector;
