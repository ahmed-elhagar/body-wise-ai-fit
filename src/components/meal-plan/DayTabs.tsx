
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
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3">
      <Tabs value={selectedDayNumber.toString()} onValueChange={(value) => onDayChange(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-7 bg-slate-100/80 rounded-xl p-2 h-auto border border-slate-200/50">
          {weekDays.map((day) => (
            <TabsTrigger 
              key={day.number} 
              value={day.number.toString()}
              className="flex flex-col py-4 px-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 rounded-xl font-medium transition-all duration-300 min-h-[70px] text-center hover:bg-white/60 transform data-[state=active]:scale-105"
            >
              <span className="text-xs opacity-70 mb-1 font-medium">{day.name}</span>
              <span className="text-xl font-bold">{format(day.date, 'd')}</span>
              <span className="text-xs opacity-70 mt-1 hidden sm:block font-medium">{format(day.date, 'MMM')}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DayTabs;
