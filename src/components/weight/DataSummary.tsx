
interface DataSummaryProps {
  chartData: Array<{ weight: number }>;
  timeRange: number;
}

const DataSummary = ({ chartData, timeRange }: DataSummaryProps) => {
  if (chartData.length <= 1) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Total Change</p>
          <p className="font-semibold text-gray-800">
            {(chartData[chartData.length - 1].weight - chartData[0].weight).toFixed(1)} kg
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Avg Weight</p>
          <p className="font-semibold text-gray-800">
            {(chartData.reduce((sum, d) => sum + d.weight, 0) / chartData.length).toFixed(1)} kg
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Data Points</p>
          <p className="font-semibold text-gray-800">{chartData.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Time Period</p>
          <p className="font-semibold text-gray-800">{timeRange} days</p>
        </div>
      </div>
    </div>
  );
};

export default DataSummary;
