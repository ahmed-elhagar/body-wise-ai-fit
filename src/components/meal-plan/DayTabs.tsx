
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays } from "date-fns";

interface DayTabsProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
}

const DayTabs = ({ weekStartDate, selectedDayNumber, onDayChange }: DayTabsProps) => {
  const weekDays = [
    { number: 1, name: 'Sat', date: weekStartDate },
    { number: 2, name: 'Sun', date: addDays(weekStartDate, 1) },
    { number: 3, name: 'Mon', date: addDays(weekStartDate, 2) },
    { number: 4, name: 'Tue', date: addDays(weekStartDate, 3) },
    { number: 5, name: 'Wed', date: addDays(weekStartDate, 4) },
    { number: 6, name: 'Thu', date: addDays(weekStartDate, 5) },
    { number: 7, name: 'Fri', date: addDays(weekStartDate, 6) }
  ];

  return (
    <div className="flex justify-center">
      <Tabs value={selectedDayNumber.toString()} onValueChange={(value) => onDayChange(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 shadow-sm rounded-xl h-auto p-1 max-w-2xl">
          {weekDays.map((day) => (
            <TabsTrigger 
              key={day.number} 
              value={day.number.toString()}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-900 transition-all duration-200 flex flex-col py-3 rounded-lg font-medium h-auto"
            >
              <span className="text-xs font-medium opacity-80 mb-1">
                {day.name}
              </span>
              <span className="text-lg font-semibold">
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
