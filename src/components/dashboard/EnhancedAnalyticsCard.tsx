
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface AnalyticsData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  description: string;
}

interface EnhancedAnalyticsCardProps {
  data: AnalyticsData;
}

const EnhancedAnalyticsCard = ({ data }: EnhancedAnalyticsCardProps) => {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {data.trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={data.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(data.change)}%
          </span>
          <span>{data.description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAnalyticsCard;
