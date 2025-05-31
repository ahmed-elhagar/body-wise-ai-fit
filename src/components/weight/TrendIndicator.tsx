
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex items-center gap-2">
      {trend.direction === 'up' && (
        <Badge variant="warning" size="sm" className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          +{trend.change.toFixed(1)} kg
        </Badge>
      )}
      {trend.direction === 'down' && (
        <Badge variant="success" size="sm" className="flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          {trend.change.toFixed(1)} kg
        </Badge>
      )}
      {trend.direction === 'neutral' && (
        <Badge variant="secondary" size="sm" className="flex items-center gap-1">
          <Minus className="w-3 h-3" />
          Stable
        </Badge>
      )}
    </div>
  );
};

export default TrendIndicator;
