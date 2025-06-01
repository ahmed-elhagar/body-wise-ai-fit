
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Activity 
} from 'lucide-react';
import { useI18n } from "@/hooks/useI18n";

interface ProgressDataPoint {
  date: string;
  weight?: number;
  calories?: number;
  exercise?: number;
  mood?: number;
}

interface InteractiveProgressChartProps {
  data: ProgressDataPoint[];
  className?: string;
}

export const InteractiveProgressChart = ({ data, className }: InteractiveProgressChartProps) => {
  const { t } = useI18n();
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'calories' | 'exercise' | 'mood'>('weight');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Filter data based on time range
  const filteredData = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return data.filter(point => new Date(point.date) >= cutoffDate);
  }, [data, timeRange]);

  // Calculate trend
  const trend = useMemo(() => {
    if (filteredData.length < 2) return null;
    
    const firstValue = filteredData[0][selectedMetric];
    const lastValue = filteredData[filteredData.length - 1][selectedMetric];
    
    if (!firstValue || !lastValue) return null;
    
    const change = lastValue - firstValue;
    const percentage = (change / firstValue) * 100;
    
    return { change, percentage, isPositive: change > 0 };
  }, [filteredData, selectedMetric]);

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'weight': return 'text-blue-600';
      case 'calories': return 'text-green-600';
      case 'exercise': return 'text-purple-600';
      case 'mood': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'weight': return 'kg';
      case 'calories': return 'cal';
      case 'exercise': return 'min';
      case 'mood': return '/10';
      default: return '';
    }
  };

  // Simple bar chart implementation
  const maxValue = Math.max(...filteredData.map(point => point[selectedMetric] || 0));
  const minValue = Math.min(...filteredData.map(point => point[selectedMetric] || 0));

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('Progress Chart')}
          </CardTitle>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Metric Selector */}
        <div className="flex gap-2 flex-wrap">
          {(['weight', 'calories', 'exercise', 'mood'] as const).map((metric) => (
            <Button
              key={metric}
              variant={selectedMetric === metric ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric(metric)}
              className={selectedMetric === metric ? '' : getMetricColor(metric)}
            >
              {t(metric.charAt(0).toUpperCase() + metric.slice(1))}
            </Button>
          ))}
        </div>

        {/* Trend Summary */}
        {trend && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('Trend')}</p>
                <div className="flex items-center gap-2">
                  {trend.isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.isPositive ? '+' : ''}{trend.change.toFixed(1)} {getMetricUnit(selectedMetric)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({trend.isPositive ? '+' : ''}{trend.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <Badge variant={trend.isPositive ? 'default' : 'secondary'}>
                {timeRange}
              </Badge>
            </div>
          </div>
        )}

        {/* Simple Bar Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('Recent Progress')}</span>
            <span>{t(selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1))}</span>
          </div>
          
          <div className="h-48 flex items-end gap-1 bg-gray-50 rounded-lg p-4">
            {filteredData.slice(-10).map((point, index) => {
              const value = point[selectedMetric] || 0;
              const height = maxValue > minValue ? ((value - minValue) / (maxValue - minValue)) * 100 : 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600 ${getMetricColor(selectedMetric)}`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${value} ${getMetricUnit(selectedMetric)}`}
                  />
                  <span className="text-xs text-gray-500 writing-mode-vertical">
                    {new Date(point.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{t('Average')}</p>
            <p className="font-medium">
              {(filteredData.reduce((sum, point) => sum + (point[selectedMetric] || 0), 0) / filteredData.length).toFixed(1)}
              {getMetricUnit(selectedMetric)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{t('Best')}</p>
            <p className="font-medium">
              {maxValue.toFixed(1)}{getMetricUnit(selectedMetric)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{t('Entries')}</p>
            <p className="font-medium">{filteredData.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveProgressChart;
