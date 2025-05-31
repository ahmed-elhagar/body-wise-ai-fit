
import { format, addDays } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMealPlanTranslation } from "@/utils/translationHelpers";

interface DayTabsProps {
  weekStartDate: Date;
  selectedDayNumber: number;
  onDayChange: (dayNumber: number) => void;
}

const DayTabs = ({
  weekStartDate,
  selectedDayNumber,
  onDayChange
}: DayTabsProps) => {
  const { mealPlanT } = useMealPlanTranslation();

  const weekDays = [
    { number: 1, name: mealPlanT('sat'), fullName: mealPlanT('saturday'), date: weekStartDate },
    { number: 2, name: mealPlanT('sun'), fullName: mealPlanT('sunday'), date: addDays(weekStartDate, 1) },
    { number: 3, name: mealPlanT('mon'), fullName: mealPlanT('monday'), date: addDays(weekStartDate, 2) },
    { number: 4, name: mealPlanT('tue'), fullName: mealPlanT('tuesday'), date: addDays(weekStartDate, 3) },
    { number: 5, name: mealPlanT('wed'), fullName: mealPlanT('wednesday'), date: addDays(weekStartDate, 4) },
    { number: 6, name: mealPlanT('thu'), fullName: mealPlanT('thursday'), date: addDays(weekStartDate, 5) },
    { number: 7, name: mealPlanT('fri'), fullName: mealPlanT('friday'), date: addDays(weekStartDate, 6) }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
      <Tabs value={selectedDayNumber.toString()} onValueChange={(value) => onDayChange(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-7 bg-gray-50 rounded-lg p-1 h-auto">
          {weekDays.map((day) => (
            <TabsTrigger 
              key={day.number} 
              value={day.number.toString()}
              className="flex flex-col py-3 px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg font-medium transition-all min-h-[60px] text-center"
            >
              <span className="text-xs opacity-70 mb-1">{day.name}</span>
              <span className="text-lg font-bold">{format(day.date, 'd')}</span>
              <span className="text-xs opacity-70 mt-1 hidden sm:block">{format(day.date, 'MMM')}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DayTabs;
