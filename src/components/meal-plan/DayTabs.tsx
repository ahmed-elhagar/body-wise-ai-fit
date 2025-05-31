
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          Week Days
        </h3>
        <div className="flex overflow-x-auto scrollbar-hide gap-3">
          {days.map(({ dayNumber, date, isSelected, isToday, dayName, dayDate, fullDayName }) => (
            <button
              key={dayNumber}
              onClick={() => onDayChange(dayNumber)}
              className={`flex flex-col items-center min-w-[90px] px-4 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? "bg-gradient-to-br from-fitness-primary-500 to-fitness-primary-600 text-white shadow-2xl scale-105 border-2 border-fitness-primary-400"
                  : isToday
                  ? "bg-gradient-to-br from-fitness-orange-100 to-fitness-orange-200 text-fitness-orange-800 border-2 border-fitness-orange-300 hover:from-fitness-orange-200 hover:to-fitness-orange-300 shadow-lg"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border-2 border-gray-200 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300 shadow-md"
              }`}
            >
              {/* Full Day Name */}
              <span className={`text-xs font-bold mb-1 ${
                isSelected 
                  ? "text-white/90" 
                  : isToday 
                  ? "text-fitness-orange-700" 
                  : "text-gray-500"
              }`}>
                {fullDayName}
              </span>
              
              {/* Day Date */}
              <span className={`text-2xl font-bold ${
                isSelected 
                  ? "text-white" 
                  : isToday 
                  ? "text-fitness-orange-800" 
                  : "text-gray-800"
              }`}>
                {dayDate}
              </span>
              
              {/* Short Day Name */}
              <span className={`text-xs font-medium mt-1 ${
                isSelected 
                  ? "text-white/80" 
                  : isToday 
                  ? "text-fitness-orange-600" 
                  : "text-gray-500"
              }`}>
                {dayName}
              </span>
              
              {/* Today Indicator */}
              {isToday && !isSelected && (
                <div className="w-2 h-2 bg-fitness-orange-500 rounded-full mt-2 animate-pulse"></div>
              )}
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="w-3 h-3 bg-white rounded-full mt-2 shadow-lg"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayTabs;
