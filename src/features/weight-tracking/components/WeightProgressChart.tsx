
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { WeightEntry } from "@/hooks/useWeightTracking";

interface WeightProgressChartProps {
  weightEntries: WeightEntry[];
  data?: Array<{
    date: string;
    weight: number;
  }>;
  targetWeight?: number;
}

export const WeightProgressChart = ({ weightEntries, data, targetWeight }: WeightProgressChartProps) => {
  // Use provided data or convert weightEntries to chart data
  const chartData = data || weightEntries?.map(entry => ({
    date: new Date(entry.recorded_at).toLocaleDateString(),
    weight: entry.weight
  })).reverse() || [];

  if (chartData.length === 0) {
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
      <h3 className="text-lg font-semibold mb-4">Weight Progress Over Time</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          {targetWeight && (
            <ReferenceLine 
              y={targetWeight} 
              stroke="#22c55e" 
              strokeDasharray="8 8"
              label={{ value: "Target", position: "insideTopRight" }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
