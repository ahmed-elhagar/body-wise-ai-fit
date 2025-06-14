
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
}

interface WeightProgressChartProps {
  weightEntries: WeightEntry[];
}

const WeightProgressChart = ({ weightEntries }: WeightProgressChartProps) => {
  const chartData = weightEntries.map(entry => ({
    date: new Date(entry.recorded_at).toLocaleDateString(),
    weight: entry.weight
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <p>No weight entries yet. Add your first entry to see progress!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightProgressChart;
