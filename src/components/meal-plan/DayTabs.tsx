
import { format, addDays, isSameDay } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-3 bg-gradient-to-r from-fitness-primary-50 to-fitness-accent-50">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate }) => (
            <button
              key={dayNumber}
              onClick={() => onDayChange(dayNumber)}
              className={`flex flex-col items-center min-w-[60px] px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border ${
                isSelected
                  ? "bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg scale-105 border-fitness-primary-400"
                  : isToday
                  ? "bg-gradient-to-br from-fitness-orange-100 to-fitness-orange-200 text-fitness-orange-800 border-fitness-orange-300 hover:from-fitness-orange-200 hover:to-fitness-orange-300 shadow-md"
                  : "bg-gradient-to-br from-gray-50 to-white text-gray-700 border-gray-200 hover:from-gray-100 hover:to-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Day Date */}
              <span className={`text-lg font-bold mb-0.5 ${
                isSelected 
                  ? "text-white" 
                  : isToday 
                  ? "text-fitness-orange-800" 
                  : "text-gray-800"
              }`}>
                {dayDate}
              </span>
              
              {/* Short Day Name */}
              <span className={`text-xs font-semibold uppercase tracking-wide ${
                isSelected 
                  ? "text-white/90" 
                  : isToday 
                  ? "text-fitness-orange-600" 
                  : "text-gray-500"
              }`}>
                {dayName}
              </span>
              
              {/* Today Indicator */}
              {isToday && !isSelected && (
                <div className="w-1.5 h-1.5 bg-fitness-orange-500 rounded-full mt-0.5 animate-pulse"></div>
              )}
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="w-2 h-2 bg-white rounded-full mt-0.5"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayTabs;
