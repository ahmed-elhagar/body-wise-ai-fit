
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface WeightChartProps {
  chartData: Array<{
    date: string;
    weight: number;
    bodyFat: number | null;
    muscleMass: number | null;
    formattedDate: string;
  }>;
  goalWeight?: number;
}

const WeightChart = ({ chartData, goalWeight }: WeightChartProps) => {
  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      if (name === 'bodyFat') return `${value.toFixed(1)}%`;
      return `${value.toFixed(1)} kg`;
    }
    return '0.0';
  };

  const customTooltipFormatter = (value: any, name: string) => {
    return [formatTooltipValue(value, name), name === 'weight' ? 'Weight' : name === 'bodyFat' ? 'Body Fat' : 'Muscle Mass'];
  };

  return (
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
            formatter={customTooltipFormatter}
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
              strokeWidth={2}
              label={{ 
                value: `Goal: ${goalWeight}kg`, 
                position: "right",
                style: { fontSize: '12px', fill: '#ef4444' }
              }}
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
  );
};

export default WeightChart;
