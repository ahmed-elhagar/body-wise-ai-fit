
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

interface DayOverviewHeaderProps {
  selectedDayNumber: number;
  weekStartDate: Date;
  onAddSnack: () => void;
}

const getDayName = (dayNumber: number) => {
  const days = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days[dayNumber] || 'Day';
};

const getDateForDay = (dayNumber: number, weekStartDate: Date) => {
  const dayOffset = dayNumber === 6 ? 0 : dayNumber === 7 ? 1 : dayNumber + 1;
  const date = new Date(weekStartDate);
  date.setDate(date.getDate() + dayOffset);
  return date;
};

export const DayOverviewHeader = ({ selectedDayNumber, weekStartDate, onAddSnack }: DayOverviewHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-fitness-primary-600" />
          <div>
            <h2 className="text-2xl font-bold text-fitness-primary-800">
              {getDayName(selectedDayNumber)}
            </h2>
            <p className="text-sm text-fitness-primary-600">
              {format(getDateForDay(selectedDayNumber, weekStartDate), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onAddSnack}
            className="bg-fitness-accent-500 hover:bg-fitness-accent-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Snack
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};
