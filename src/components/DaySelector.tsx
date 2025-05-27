
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DaySelectorProps {
  selectedDayNumber: number;
  onDaySelect: (dayNumber: number) => void;
}

const DaySelector = ({ selectedDayNumber, onDaySelect }: DaySelectorProps) => {
  return (
    <Card className="mb-6 p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Day</h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
          <Button
            key={day}
            variant={selectedDayNumber === index + 1 ? "default" : "outline"}
            className={`${selectedDayNumber === index + 1 ? 'bg-fitness-gradient text-white' : 'bg-white/80'}`}
            onClick={() => onDaySelect(index + 1)}
          >
            {day}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default DaySelector;
