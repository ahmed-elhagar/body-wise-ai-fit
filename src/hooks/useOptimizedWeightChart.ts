
import { useState, useMemo } from 'react';
import { WeightEntry } from './useWeightTracking';

export const useOptimizedWeightChart = (weightEntries: WeightEntry[], timeRange: 30 | 90 | 180) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    if (!weightEntries.length) {
      return {
        averageWeight: 0,
        highestWeight: 0,
        lowestWeight: 0,
        totalEntries: 0,
        trend: 'stable' as 'stable' | 'up' | 'down',
        trendPercentage: 0
      };
    }

    const weights = weightEntries.map(entry => entry.weight);
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    
    return {
      averageWeight: (total / weights.length).toFixed(1),
      highestWeight: Math.max(...weights).toFixed(1),
      lowestWeight: Math.min(...weights).toFixed(1),
      totalEntries: weights.length,
      trend: 'stable' as 'stable' | 'up' | 'down',
      trendPercentage: 0
    };
  }, [weightEntries]);

  const hasData = weightEntries.length > 0;

  return {
    chartData,
    isLoading,
    stats,
    hasData
  };
};
