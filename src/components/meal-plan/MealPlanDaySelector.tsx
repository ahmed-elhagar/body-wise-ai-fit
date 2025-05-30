
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, addDays } from "date-fns";

interface MealPlanDaySelectorProps {
  selectedDay: number;
  onDaySelect: (day: number) => void;
  weekStartDate: Date;
}

const MealPlanDaySelector = ({
  selectedDay,
  onDaySelect,
  weekStartDate
}: MealPlanDaySelectorProps) => {
  const days = [
    { number: 6, name: 'Sat' },
    { number: 7, name: 'Sun' },
    { number: 1, name: 'Mon' },
    { number: 2, name: 'Tue' },
    { number: 3, name: 'Wed' },
    { number: 4, name: 'Thu' },
    { number: 5, name: 'Fri' }
  ];

  const getDateForDay = (dayNumber: number) => {
    const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
    return addDays(weekStartDate, dayOffset);
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {days.map((day) => {
          const dayDate = getDateForDay(day.number);
          const isSelected = selectedDay === day.number;
          const isToday = format(dayDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <Button
              key={day.number}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onDaySelect(day.number)}
              className={`flex flex-col h-16 min-w-16 ${isToday ? 'ring-2 ring-fitness-primary' : ''}`}
            >
              <span className="text-xs font-medium">{day.name}</span>
              <span className="text-lg font-bold">{format(dayDate, 'd')}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default MealPlanDaySelector;
