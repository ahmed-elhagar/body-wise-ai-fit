
import { Badge } from "@/components/ui/badge";

interface ChartLegendProps {
  chartData: Array<{ 
    bodyFat: number | null; 
    muscleMass: number | null; 
  }>;
  goalWeight?: number;
}

const ChartLegend = ({ chartData, goalWeight }: ChartLegendProps) => {
  if (chartData.length === 0) return null;

  return (
    <div className="section-spacing">
      <div className="flex justify-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-r from-fitness-primary-500 to-fitness-primary-600 rounded-full"></div>
          <Badge variant="outline" size="sm">Weight</Badge>
        </div>
        
        {goalWeight && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 bg-error-500 border-dashed border border-error-500"></div>
            <Badge variant="outline" size="sm">Goal Weight</Badge>
          </div>
        )}
        
        {chartData.some(d => d.bodyFat !== null) && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-fitness-orange-500 to-fitness-orange-600 rounded-full"></div>
            <Badge variant="orange" size="sm">Body Fat %</Badge>
          </div>
        )}
        
        {chartData.some(d => d.muscleMass !== null) && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-success-500 to-success-600 rounded-full"></div>
            <Badge variant="success" size="sm">Muscle Mass</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartLegend;
