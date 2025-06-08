
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface ChartData {
  name: string;
  value: number;
  target?: number;
}

interface InteractiveProgressChartProps {
  data: ChartData[];
  title: string;
  dataKey: string;
  color?: string;
}

const InteractiveProgressChart = ({ 
  data, 
  title, 
  dataKey, 
  color = '#3b82f6' 
}: InteractiveProgressChartProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              labelFormatter={(label) => `${t('dashboard:date') || 'Date'}: ${label}`}
              formatter={(value, name) => [value, t(`dashboard:${name}`) || name]}
            />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InteractiveProgressChart;
