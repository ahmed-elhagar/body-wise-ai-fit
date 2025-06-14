
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate, formatTooltip } from './ChartUtils';

interface CalorieChartProps {
  data: any[];
  color: string;
}

const CalorieChart = ({ data, color }: CalorieChartProps) => {
  return (
    <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
      <Area 
        type="monotone" 
        dataKey="consumed" 
        stackId="1"
        stroke={color}
        fill={color}
        fillOpacity={0.6}
      />
      <Area 
        type="monotone" 
        dataKey="burned" 
        stackId="2"
        stroke="#10b981"
        fill="#10b981"
        fillOpacity={0.4}
      />
    </AreaChart>
  );
};

export default CalorieChart;
