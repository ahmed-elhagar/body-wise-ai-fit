
import { ResponsiveContainer } from 'recharts';
import WeightChart from './WeightChart';
import CalorieChart from './CalorieChart';
import WorkoutChart from './WorkoutChart';

interface ChartRendererProps {
  activeChart: 'weight' | 'calories' | 'workouts';
  data: any[];
  color: string;
}

const ChartRenderer = ({ activeChart, data, color }: ChartRendererProps) => {
  const renderChart = () => {
    switch (activeChart) {
      case 'weight':
        return <WeightChart data={data} color={color} />;
      case 'calories':
        return <CalorieChart data={data} color={color} />;
      case 'workouts':
        return <WorkoutChart data={data} color={color} />;
      default:
        return <WeightChart data={data} color={color} />;
    }
  };

  return (
    <div className="h-48 sm:h-64 lg:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;
