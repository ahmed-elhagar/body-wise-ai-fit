
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/hooks/useI18n';

interface DataPoint {
  date: string;
  value: number;
}

interface InteractiveProgressChartProps {
  data?: DataPoint[];
  title?: string;
  dataKey?: string;
  color?: string;
}

const InteractiveProgressChart = ({ 
  data, 
  title, 
  dataKey, 
  color = '#3B82F6' 
}: InteractiveProgressChartProps) => {
  const { t, isRTL } = useI18n();

  // Default data if none provided
  const defaultData: DataPoint[] = [
    { date: 'Jan', value: 75 },
    { date: 'Feb', value: 73 },
    { date: 'Mar', value: 71 },
    { date: 'Apr', value: 69 },
    { date: 'May', value: 67 },
    { date: 'Jun', value: 65 }
  ];

  const chartData = data || defaultData;
  const chartTitle = title || t('dashboard:progressOverTime') || 'Progress Over Time';
  const chartDataKey = dataKey || 'value';

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className={isRTL ? 'text-right font-arabic' : 'text-left'}>
          {chartTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={chartDataKey} 
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveProgressChart;
