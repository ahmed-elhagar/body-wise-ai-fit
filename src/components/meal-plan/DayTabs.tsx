
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays } from "date-fns";

interface DayTabsProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
}

const DayTabs = ({ weekStartDate, selectedDayNumber, onDayChange }: DayTabsProps) => {
  const weekDays = [
    { number: 1, name: 'Saturday', date: weekStartDate },
    { number: 2, name: 'Sunday', date: addDays(weekStartDate, 1) },
    { number: 3, name: 'Monday', date: addDays(weekStartDate, 2) },
    { number: 4, name: 'Tuesday', date: addDays(weekStartDate, 3) },
    { number: 5, name: 'Wednesday', date: addDays(weekStartDate, 4) },
    { number: 6, name: 'Thursday', date: addDays(weekStartDate, 5) },
    { number: 7, name: 'Friday', date: addDays(weekStartDate, 6) }
  ];

  return (
    <div className="flex justify-center mt-6">
      <Tabs value={selectedDayNumber.toString()} onValueChange={(value) => onDayChange(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 shadow-sm rounded-lg h-auto p-1 max-w-2xl">
          {weekDays.map((day) => (
            <TabsTrigger 
              key={day.number} 
              value={day.number.toString()}
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-600 hover:text-gray-900 transition-all duration-200 flex flex-col py-3 rounded-md font-normal h-auto"
            >
              <span className="text-xs font-medium opacity-80 mb-1">
                {day.name.slice(0, 3)}
              </span>
              <span className="text-lg font-medium">
                {format(day.date, 'd')}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DayTabs;
