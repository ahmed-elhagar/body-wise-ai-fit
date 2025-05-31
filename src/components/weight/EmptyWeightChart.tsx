
import { Scale } from "lucide-react";

const EmptyWeightChart = () => {
  return (
    <div className="text-center py-12">
      <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Weight Data Yet</h3>
      <p className="text-gray-500">Start logging your weight to see your progress chart</p>
    </div>
  );
};

export default EmptyWeightChart;
