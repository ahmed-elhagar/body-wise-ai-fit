
import { useMemo } from "react";
import { subDays, format } from "date-fns";
import { WeightEntry } from "@/hooks/useWeightTracking";

export const useWeightChartData = (weightEntries: WeightEntry[], timeRange: 30 | 90 | 180) => {
  return useMemo(() => {
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
};
