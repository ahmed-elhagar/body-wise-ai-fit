
import { useState } from 'react';

export interface WeightEntry {
  id: string;
  weight: number;
  recorded_at: string;
  body_fat_percentage?: number;
  muscle_mass?: number;
  notes?: string;
}

export const useWeightTracking = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightGoal, setWeightGoal] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  const addWeightEntry = async (entryData: Partial<WeightEntry>) => {
    setIsAdding(true);
    try {
      console.log('Adding weight entry:', entryData);
      // Mock implementation
      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        weight: entryData.weight || 0,
        recorded_at: entryData.recorded_at || new Date().toISOString(),
        body_fat_percentage: entryData.body_fat_percentage,
        muscle_mass: entryData.muscle_mass,
        notes: entryData.notes
      };
      setWeightEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('Error adding weight entry:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return {
    weightEntries,
    isLoading,
    isAdding,
    currentWeight,
    weightGoal,
    weeklyProgress,
    addWeightEntry
  };
};
