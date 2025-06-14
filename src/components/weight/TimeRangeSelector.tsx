
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
    <div className="flex gap-1 bg-fitness-neutral-100/90 backdrop-blur-sm rounded-xl p-1.5 shadow-sm border border-fitness-neutral-200/50">
      {timeRangeOptions.map((option) => (
        <Button
          key={option.days}
          variant={timeRange === option.days ? "default" : "ghost"}
          size="sm"
          onClick={() => onTimeRangeChange(option.days as 30 | 90 | 180)}
          className={`
            text-xs font-semibold transition-all duration-300 rounded-lg px-4 py-2.5
            ${timeRange === option.days 
              ? 'bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 text-white shadow-lg hover:from-fitness-primary-600 hover:to-fitness-primary-700'
              : 'text-fitness-neutral-600 hover:text-fitness-neutral-900 hover:bg-white/80'
            }
          `}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
