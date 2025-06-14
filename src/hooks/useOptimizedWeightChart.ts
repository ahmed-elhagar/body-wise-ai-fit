
import { useWeightTracking } from './useWeightTracking';
import { useMemo } from 'react';

export const useOptimizedWeightChart = (timeRange: string = '30d') => {
  const { weightEntries, isLoading } = useWeightTracking();

  const chartData = useMemo(() => {
    if (!weightEntries || weightEntries.length === 0) return [];

    const now = new Date();
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };

    const days = daysMap[timeRange] || 30;
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    return weightEntries
      .filter(entry => new Date(entry.recorded_at) >= cutoffDate)
      .map(entry => ({
        date: entry.recorded_at,
        weight: entry.weight,
        bmi: entry.bmi,
        bodyFat: entry.body_fat_percentage,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [weightEntries, timeRange]);

  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const weights = chartData.map(d => d.weight);
    const latest = weights[weights.length - 1];
    const previous = weights[weights.length - 2];
    const change = previous ? latest - previous : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

    return {
      current: latest,
      change,
      trend,
      min: Math.min(...weights),
      max: Math.max(...weights),
      average: weights.reduce((sum, w) => sum + w, 0) / weights.length,
    };
  }, [chartData]);

  return {
    chartData,
    stats,
    isLoading,
  };
};
