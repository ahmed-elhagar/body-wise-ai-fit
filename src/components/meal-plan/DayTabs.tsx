
import { format, addDays } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  const weekDays = [
    { number: 1, name: t('mealPlan.sat'), fullName: t('mealPlan.saturday'), date: weekStartDate },
    { number: 2, name: t('mealPlan.sun'), fullName: t('mealPlan.sunday'), date: addDays(weekStartDate, 1) },
    { number: 3, name: t('mealPlan.mon'), fullName: t('mealPlan.monday'), date: addDays(weekStartDate, 2) },
    { number: 4, name: t('mealPlan.tue'), fullName: t('mealPlan.tuesday'), date: addDays(weekStartDate, 3) },
    { number: 5, name: t('mealPlan.wed'), fullName: t('mealPlan.wednesday'), date: addDays(weekStartDate, 4) },
    { number: 6, name: t('mealPlan.thu'), fullName: t('mealPlan.thursday'), date: addDays(weekStartDate, 5) },
    { number: 7, name: t('mealPlan.fri'), fullName: t('mealPlan.friday'), date: addDays(weekStartDate, 6) }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
      <Tabs value={selectedDayNumber.toString()} onValueChange={(value) => onDayChange(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-7 bg-gray-50 rounded-lg p-1">
          {weekDays.map((day) => (
            <TabsTrigger 
              key={day.number} 
              value={day.number.toString()}
              className="flex flex-col py-3 px-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md font-medium transition-all"
            >
              <span className="text-xs mb-1 opacity-70">{day.name}</span>
              <span className="text-lg font-semibold">{format(day.date, 'd')}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DayTabs;
