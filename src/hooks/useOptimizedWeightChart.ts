
import { useMemo } from "react";
import { subDays, format } from "date-fns";
import { WeightEntry } from "@/hooks/useWeightTracking";

export interface ChartDataPoint {
  date: string;
  weight: number;
  bodyFat: number | null;
  muscleMass: number | null;
  formattedDate: string;
}

export interface WeightChartStats {
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  highestWeight: number;
  lowestWeight: number;
  averageWeight: number;
  totalEntries: number;
}

export const useOptimizedWeightChart = (weightEntries: WeightEntry[], timeRange: 30 | 90 | 180) => {
  // Memoized chart data with optimized filtering and processing
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!weightEntries || weightEntries.length === 0) return [];
    
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

  // Memoized statistics calculation
  const stats = useMemo((): WeightChartStats => {
    if (chartData.length === 0) {
      return {
        trend: 'stable',
        trendPercentage: 0,
        highestWeight: 0,
        lowestWeight: 0,
        averageWeight: 0,
        totalEntries: 0,
      };
    }

    const weights = chartData.map(d => d.weight);
    const highestWeight = Math.max(...weights);
    const lowestWeight = Math.min(...weights);
    const averageWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    
    // Calculate trend based on first and last entries
    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercentage = 0;
    
    if (chartData.length >= 2) {
      const firstWeight = chartData[0].weight;
      const lastWeight = chartData[chartData.length - 1].weight;
      const difference = lastWeight - firstWeight;
      trendPercentage = Math.abs((difference / firstWeight) * 100);
      
      if (Math.abs(difference) > 0.5) { // Only consider significant changes
        trend = difference > 0 ? 'up' : 'down';
      }
    }

    return {
      trend,
      trendPercentage: Number(trendPercentage.toFixed(1)),
      highestWeight: Number(highestWeight.toFixed(1)),
      lowestWeight: Number(lowestWeight.toFixed(1)),
      averageWeight: Number(averageWeight.toFixed(1)),
      totalEntries: chartData.length,
    };
  }, [chartData]);

  // Memoized time range options
  const timeRangeOptions = useMemo(() => [
    { value: 30 as const, label: 'Last 30 days' },
    { value: 90 as const, label: 'Last 3 months' },
    { value: 180 as const, label: 'Last 6 months' },
  ], []);

  return {
    chartData,
    stats,
    timeRangeOptions,
    hasData: chartData.length > 0,
  };
};
