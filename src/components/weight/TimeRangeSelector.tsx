
import { Button } from "@/components/ui/button";

interface TimeRangeSelectorProps {
  timeRange: 30 | 90 | 180;
  onTimeRangeChange: (range: 30 | 90 | 180) => void;
}

const TimeRangeSelector = ({ timeRange, onTimeRangeChange }: TimeRangeSelectorProps) => {
  const timeRangeOptions = [
    { days: 30, label: '30 Days' },
    { days: 90, label: '90 Days' },
    { days: 180, label: '6 Months' },
  ];

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {timeRangeOptions.map((option) => (
        <Button
          key={option.days}
          variant={timeRange === option.days ? "default" : "ghost"}
          size="sm"
          onClick={() => onTimeRangeChange(option.days as 30 | 90 | 180)}
          className="text-xs"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
