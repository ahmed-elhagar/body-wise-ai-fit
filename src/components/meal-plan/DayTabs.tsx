
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
      dayDate: format(date, 'd')
    };
  });

  return (
    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide gap-2">
        {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate }) => (
          <button
            key={dayNumber}
            onClick={() => onDayChange(dayNumber)}
            className={`flex flex-col items-center min-w-[80px] px-4 py-3 rounded-xl font-medium transition-all duration-300 transform ${
              isSelected
                ? "bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg scale-105 border-2 border-fitness-primary-400"
                : isToday
                ? "bg-fitness-orange-100 text-fitness-orange-700 border-2 border-fitness-orange-300 hover:bg-fitness-orange-200"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {/* Day Name */}
            <span className={`text-xs font-semibold mb-1 ${
              isSelected 
                ? "text-white" 
                : isToday 
                ? "text-fitness-orange-700" 
                : "text-gray-500"
            }`}>
              {dayName}
            </span>
            
            {/* Day Date */}
            <span className={`text-lg font-bold ${
              isSelected 
                ? "text-white" 
                : isToday 
                ? "text-fitness-orange-800" 
                : "text-gray-700"
            }`}>
              {dayDate}
            </span>
            
            {/* Today Indicator */}
            {isToday && !isSelected && (
              <div className="w-2 h-2 bg-fitness-orange-500 rounded-full mt-1"></div>
            )}
            
            {/* Selected Indicator */}
            {isSelected && (
              <div className="w-2 h-2 bg-white rounded-full mt-1"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DayTabs;
