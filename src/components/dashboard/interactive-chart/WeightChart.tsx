
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDate, formatTooltip } from './ChartUtils';

interface WeightChartProps {
  data: any[];
  color: string;
}

const WeightChart = ({ data, color }: WeightChartProps) => {
  return (
    <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
        domain={['dataMin - 2', 'dataMax + 1']}
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
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke={color}
        strokeWidth={2}
        dot={{ fill: color, strokeWidth: 2, r: 3 }}
        activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
      />
      <Line 
        type="monotone" 
        dataKey="target" 
        stroke="#dc2626"
        strokeWidth={2}
        strokeDasharray="5 5"
        dot={false}
      />
    </LineChart>
  );
};

export default WeightChart;
