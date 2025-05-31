
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  chartData: Array<{ weight: number }>;
}

const TrendIndicator = ({ chartData }: TrendIndicatorProps) => {
  const getTrend = () => {
    if (chartData.length < 2) return { direction: 'neutral', change: 0 };
    
    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    const change = latest.weight - previous.weight;
    
    if (change > 0.1) return { direction: 'up', change };
    if (change < -0.1) return { direction: 'down', change };
    return { direction: 'neutral', change };
  };

  const trend = getTrend();

  if (chartData.length < 2) return null;

  return (
    <div className="flex items-center space-x-2">
      {trend.direction === 'up' && (
        <div className="flex items-center text-orange-600">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">+{trend.change.toFixed(1)} kg</span>
        </div>
      )}
      {trend.direction === 'down' && (
        <div className="flex items-center text-green-600">
          <TrendingDown className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">{trend.change.toFixed(1)} kg</span>
        </div>
      )}
      {trend.direction === 'neutral' && (
        <div className="flex items-center text-gray-600">
          <Minus className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Stable</span>
        </div>
      )}
    </div>
  );
};

export default TrendIndicator;
