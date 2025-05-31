
import { Badge } from "@/components/ui/badge";

interface DataSummaryProps {
  chartData: Array<{ weight: number }>;
  timeRange: number;
}

const DataSummary = ({ chartData, timeRange }: DataSummaryProps) => {
  if (chartData.length <= 1) return null;

  const totalChange = chartData[chartData.length - 1].weight - chartData[0].weight;
  const avgWeight = chartData.reduce((sum, d) => sum + d.weight, 0) / chartData.length;

  return (
    <div className="section-spacing">
      <div className="bg-gradient-to-br from-fitness-neutral-50 to-white rounded-2xl card-padding border border-fitness-neutral-200/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-2">
            <p className="text-sm font-medium text-fitness-neutral-600">Total Change</p>
            <Badge variant={totalChange >= 0 ? "success" : "warning"} size="lg" className="font-bold">
              {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)} kg
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-fitness-neutral-600">Avg Weight</p>
            <Badge variant="default" size="lg" className="font-bold">
              {avgWeight.toFixed(1)} kg
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-fitness-neutral-600">Data Points</p>
            <Badge variant="info" size="lg" className="font-bold">
              {chartData.length}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-fitness-neutral-600">Time Period</p>
            <Badge variant="secondary" size="lg" className="font-bold">
              {timeRange} days
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;
