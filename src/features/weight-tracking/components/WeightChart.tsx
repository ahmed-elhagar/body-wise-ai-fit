
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightChartProps {
  data: Array<{
    date: string;
    weight: number;
  }>;
}

export const WeightChart = ({ data }: WeightChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No weight data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weight Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
