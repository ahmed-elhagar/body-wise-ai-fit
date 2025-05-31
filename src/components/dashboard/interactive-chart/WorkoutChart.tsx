
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate, formatTooltip } from './ChartUtils';

interface WorkoutChartProps {
  data: any[];
  color: string;
}

const WorkoutChart = ({ data, color }: WorkoutChartProps) => {
  return (
    <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis 
        dataKey="date" 
        tickFormatter={formatDate}
        stroke="#6b7280"
        fontSize={10}
        interval="preserveStartEnd"
      />
      <YAxis 
        stroke="#6b7280"
        fontSize={10}
      />
      <Tooltip 
        formatter={formatTooltip}
        labelFormatter={(value) => formatDate(value)}
        contentStyle={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          fontSize: '12px'
        }}
      />
      <Bar 
        dataKey="duration" 
        fill={color}
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  );
};

export default WorkoutChart;
