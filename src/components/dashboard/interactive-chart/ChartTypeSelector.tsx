
import { Button } from "@/components/ui/button";
import { Scale, Flame, Activity } from "lucide-react";

interface ChartTypeSelectorProps {
  activeChart: 'weight' | 'calories' | 'workouts';
  onChartChange: (chart: 'weight' | 'calories' | 'workouts') => void;
}

const ChartTypeSelector = ({ activeChart, onChartChange }: ChartTypeSelectorProps) => {
  const chartConfig = {
    weight: { title: 'Weight Progress', icon: Scale },
    calories: { title: 'Calorie Tracking', icon: Flame },
    workouts: { title: 'Workout Duration', icon: Activity }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(chartConfig).map(([key, config]) => (
        <Button
          key={key}
          variant={activeChart === key ? "default" : "outline"}
          size="sm"
          onClick={() => onChartChange(key as any)}
          className="text-xs flex-1 sm:flex-none min-w-0"
        >
          <config.icon className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{config.title.split(' ')[0]}</span>
        </Button>
      ))}
    </div>
  );
};

export default ChartTypeSelector;
