
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface WeeklyProgramOverviewProps {
  currentProgram: any;
  selectedDay: number;
  onDaySelect: (day: number) => void;
}

export const WeeklyProgramOverview = ({ currentProgram, selectedDay, onDaySelect }: WeeklyProgramOverviewProps) => {
  const weekDays = [
    { day: 1, name: "Monday" },
    { day: 2, name: "Tuesday" },
    { day: 3, name: "Wednesday" },
    { day: 4, name: "Thursday" },
    { day: 5, name: "Friday" },
    { day: 6, name: "Saturday" },
    { day: 7, name: "Sunday" }
  ];

  if (!currentProgram) return null;

  return (
    <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Exercise Program</h3>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((dayInfo) => (
          <div
            key={dayInfo.day}
            className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md cursor-pointer ${
              selectedDay === dayInfo.day 
                ? 'border-fitness-primary bg-fitness-primary/10' 
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            onClick={() => onDaySelect(dayInfo.day)}
          >
            <div className="text-center">
              <p className="font-medium text-gray-800 mb-2">{dayInfo.name}</p>
              <div className="flex items-center justify-center text-xs text-gray-600">
                <Dumbbell className="w-3 h-3 mr-1" />
                Day {dayInfo.day}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
