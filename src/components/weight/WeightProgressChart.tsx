
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Scale, Calendar } from "lucide-react";
import { WeightEntry } from "@/hooks/useWeightTracking";
import { useState, useMemo } from "react";
import { subDays, format } from "date-fns";

interface WeightProgressChartProps {
  weightEntries: WeightEntry[];
}

const WeightProgressChart = ({ weightEntries }: WeightProgressChartProps) => {
  const [timeRange, setTimeRange] = useState<30 | 90 | 180>(30);
  
  // Filter data based on time range
  const chartData = useMemo(() => {
    const cutoffDate = subDays(new Date(), timeRange);
    
    return weightEntries
      .filter(entry => new Date(entry.recorded_at) >= cutoffDate)
      .slice()
      .reverse()
      .map(entry => ({
        date: entry.recorded_at,
        weight: parseFloat(entry.weight.toString()),
        bodyFat: entry.body_fat_percentage ? parseFloat(entry.body_fat_percentage.toString()) : null,
        muscleMass: entry.muscle_mass ? parseFloat(entry.muscle_mass.toString()) : null,
        formattedDate: format(new Date(entry.recorded_at), 'MMM dd'),
      }));
  }, [weightEntries, timeRange]);

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

  // Calculate goal weight line (example: could come from user_goals table)
  const goalWeight = useMemo(() => {
    if (chartData.length === 0) return null;
    // This could be fetched from user_goals table
    // For now, we'll use a simple calculation: 10% weight loss from max weight
    const maxWeight = Math.max(...chartData.map(d => d.weight));
    return maxWeight * 0.9; // Example goal: lose 10%
  }, [chartData]);

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      if (name === 'bodyFat') return `${value.toFixed(1)}%`;
      return `${value.toFixed(1)} kg`;
    }
    return '0.0';
  };

  const timeRangeOptions = [
    { days: 30, label: '30 Days' },
    { days: 90, label: '90 Days' },
    { days: 180, label: '6 Months' },
  ];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Weight Progress
          </h3>
          <p className="text-sm text-gray-600">Track your weight journey over time</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {timeRangeOptions.map((option) => (
              <Button
                key={option.days}
                variant={timeRange === option.days ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(option.days as 30 | 90 | 180)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Trend Indicator */}
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
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value} kg`}
              />
              <Tooltip 
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value, name) => [
                  formatTooltipValue(value, name),
                  name === 'weight' ? 'Weight' : 
                  name === 'bodyFat' ? 'Body Fat' : 
                  'Muscle Mass'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {/* Goal Weight Line */}
              {goalWeight && (
                <ReferenceLine 
                  y={goalWeight} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5"
                  label={{ value: "Goal", position: "right" }}
                />
              )}
              
              {/* Main Weight Line */}
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                connectNulls={false}
              />
              
              {/* Body Fat Line */}
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
              
              {/* Muscle Mass Line */}
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

      {/* Chart Legend */}
      {chartData.length > 0 && (
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
      )}

      {/* Data Summary */}
      {chartData.length > 1 && (
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
      )}
    </Card>
  );
};

export default WeightProgressChart;
