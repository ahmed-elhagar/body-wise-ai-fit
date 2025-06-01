
import { format, addDays, isSameDay } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";

interface DayTabsProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
}

const DayTabs = ({ weekStartDate, selectedDayNumber, onDayChange }: DayTabsProps) => {
  const { t, isRTL } = useLanguage();
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, index) => {
    const dayNumber = index + 1;
    const date = addDays(weekStartDate, index);
    const isSelected = selectedDayNumber === dayNumber;
    const isToday = isSameDay(date, today);
    
    return {
      dayNumber,
      date,
      isSelected,
      isToday,
      dayName: format(date, 'EEE'),
      dayDate: format(date, 'd'),
      fullDayName: format(date, 'EEEE')
    };
  });

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-fitness-primary-200 shadow-lg overflow-hidden">
      <div className="p-3 bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate }) => (
            <button
              key={dayNumber}
              onClick={() => onDayChange(dayNumber)}
              className={`
                min-w-0 flex-shrink-0 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-center
                ${isSelected 
                  ? 'bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-fitness-primary-600 hover:bg-fitness-primary-50 hover:text-fitness-primary-700 shadow-sm'
                }
                ${isToday && !isSelected ? 'ring-2 ring-fitness-accent-300' : ''}
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-fitness-primary-500'}`}>
                  {dayName}
                </span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-fitness-primary-700'}`}>
                  {dayDate}
                </span>
                {isToday && (
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-fitness-accent-200' : 'bg-fitness-accent-500'}`} />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default DayTabs;
