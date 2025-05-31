
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
    <div className="mt-6 flex justify-center space-x-6 text-sm flex-wrap gap-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <span className="text-gray-600">Weight</span>
      </div>
      {goalWeight && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-1 bg-red-500 border-dashed border border-red-500"></div>
          <span className="text-gray-600">Goal Weight</span>
        </div>
      )}
      {chartData.some(d => d.bodyFat !== null) && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
          <span className="text-gray-600">Body Fat %</span>
        </div>
      )}
      {chartData.some(d => d.muscleMass !== null) && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Muscle Mass</span>
        </div>
      )}
    </div>
  );
};

export default ChartLegend;
