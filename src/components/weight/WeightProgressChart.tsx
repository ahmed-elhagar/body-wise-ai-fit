
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";

interface WeightProgressChartProps {
  weightEntries: WeightEntry[];
}

const WeightProgressChart = ({ weightEntries }: WeightProgressChartProps) => {
  const chartData = weightEntries
    .slice()
    .reverse()
    .map(entry => ({
      date: entry.recorded_at,
      weight: parseFloat(entry.weight.toString()),
      bodyFat: entry.body_fat_percentage ? parseFloat(entry.body_fat_percentage.toString()) : null,
      muscleMass: entry.muscle_mass ? parseFloat(entry.muscle_mass.toString()) : null,
    }));

  const getTrend = () => {
    if (chartData.length < 2) return { direction: 'neutral', change: 0 };
    
    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    const change = latest.weight - previous.weight;
    
    if (change > 0.1) return { direction: 'up', change };
    if (change < -0.1) return { direction: 'down', change };
    return { direction: 'neutral', change };
  };

  const trend = getTrend();

  const formatTooltipValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return '0.0';
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Weight Progress</h3>
          <p className="text-sm text-gray-600">Track your weight journey over time</p>
        </div>
        
        {chartData.length >= 2 && (
          <div className="flex items-center space-x-2">
            {trend.direction === 'up' && (
              <div className="flex items-center text-orange-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+{trend.change.toFixed(1)} kg</span>
              </div>
            )}
            {trend.direction === 'down' && (
              <div className="flex items-center text-green-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{trend.change.toFixed(1)} kg</span>
              </div>
            )}
            {trend.direction === 'neutral' && (
              <div className="flex items-center text-gray-600">
                <Minus className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Stable</span>
              </div>
            )}
          </div>
        )}
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  `${formatTooltipValue(value)} ${name === 'weight' ? 'kg' : name === 'bodyFat' ? '%' : 'kg'}`,
                  name === 'weight' ? 'Weight' : name === 'bodyFat' ? 'Body Fat' : 'Muscle Mass'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 5 }}
                connectNulls={false}
              />
              {chartData.some(d => d.bodyFat !== null) && (
                <Line 
                  type="monotone" 
                  dataKey="bodyFat" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
                  connectNulls={false}
                />
              )}
              {chartData.some(d => d.muscleMass !== null) && (
                <Line 
                  type="monotone" 
                  dataKey="muscleMass" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                  connectNulls={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-12">
          <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Weight Data Yet</h3>
          <p className="text-gray-500">Start logging your weight to see your progress chart</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mt-4 flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Weight</span>
          </div>
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
      )}
    </Card>
  );
};

export default WeightProgressChart;
