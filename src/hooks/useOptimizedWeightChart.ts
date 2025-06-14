
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface WeightEntry {
  id: string;
  weight: number;
  logged_at: string;
  body_fat_percentage?: number;
}

export const useOptimizedWeightChart = () => {
  const { user } = useAuth();

  const { data: weightEntries = [], isLoading } = useQuery({
    queryKey: ['weight-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('weight_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: true });

      if (error) throw error;
      return data as WeightEntry[];
    },
    enabled: !!user?.id
  });

  const chartData = weightEntries.map(entry => {
    const weight = entry.weight;
    const height = 170; // Default height - should come from profile
    const bmi = weight / Math.pow(height / 100, 2);

    return {
      date: new Date(entry.logged_at).toLocaleDateString(),
      weight: weight,
      bmi: Math.round(bmi * 10) / 10,
      bodyFat: entry.body_fat_percentage || 0
    };
  });

  const currentWeight = weightEntries[weightEntries.length - 1]?.weight || 0;
  const previousWeight = weightEntries[weightEntries.length - 2]?.weight || currentWeight;
  const change = currentWeight - previousWeight;
  
  const weights = weightEntries.map(e => e.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const averageWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length || 0;

  const trend = change > 0 ? 'increasing' : change < 0 ? 'decreasing' : 'stable';
  const trendPercentage = previousWeight > 0 ? Math.abs((change / previousWeight) * 100) : 0;

  const stats = {
    current: currentWeight,
    change: change,
    trend: trend,
    min: minWeight,
    max: maxWeight,
    average: averageWeight,
    trendPercentage: trendPercentage,
    averageWeight: averageWeight,
    highestWeight: maxWeight,
    lowestWeight: minWeight,
    totalEntries: weightEntries.length
  };

  const hasData = weightEntries.length > 0;

  return {
    chartData,
    stats,
    isLoading,
    hasData
  };
};
