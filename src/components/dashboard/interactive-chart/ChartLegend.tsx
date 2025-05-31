
interface ChartLegendProps {
  activeChart: 'weight' | 'calories' | 'workouts';
}

const ChartLegend = ({ activeChart }: ChartLegendProps) => {
  return (
    <div className="mt-3 sm:mt-4 flex justify-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap">
      {activeChart === 'weight' && (
        <>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Current Weight</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-red-600 border-dashed border border-red-600"></div>
            <span className="text-gray-600">Target Weight</span>
          </div>
        </>
      )}
      {activeChart === 'calories' && (
        <>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Consumed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Burned</span>
          </div>
        </>
      )}
      {activeChart === 'workouts' && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-gray-600">Duration (minutes)</span>
        </div>
      )}
    </div>
  );
};

export default ChartLegend;
