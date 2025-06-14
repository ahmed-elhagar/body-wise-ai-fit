
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  notes?: string;
  recorded_at: string;
  created_at: string;
}

interface WeightTrackingData {
  entries: WeightEntry[];
  latestEntry: WeightEntry | null;
  isLoading: boolean;
  error: string | null;
}

export const useWeightTracking = () => {
  const { user } = useAuth();
  const [data, setData] = useState<WeightTrackingData>({
    entries: [],
    latestEntry: null,
    isLoading: true,
    error: null
  });

  const fetchWeightEntries = async () => {
    if (!user) return;

    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: entries, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      const typedEntries = (entries || []) as WeightEntry[];
      const latestEntry = typedEntries.length > 0 ? typedEntries[0] : null;

      setData({
        entries: typedEntries,
        latestEntry,
        isLoading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Error fetching weight entries:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
    }
  };

  const addWeightEntry = async (entryData: Omit<WeightEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { data: newEntry, error } = await supabase
        .from('weight_entries')
        .insert({
          ...entryData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const typedNewEntry = newEntry as WeightEntry;

      // Update local state
      setData(prev => ({
        ...prev,
        entries: [typedNewEntry, ...prev.entries],
        latestEntry: typedNewEntry
      }));

      return typedNewEntry;
    } catch (error: any) {
      console.error('Error adding weight entry:', error);
      throw error;
    }
  };

  const deleteWeightEntry = async (entryId: string) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setData(prev => {
        const updatedEntries = prev.entries.filter(entry => entry.id !== entryId);
        const newLatestEntry = updatedEntries.length > 0 ? updatedEntries[0] : null;
        
        return {
          ...prev,
          entries: updatedEntries,
          latestEntry: newLatestEntry
        };
      });

      toast.success('Weight entry deleted successfully');
    } catch (error: any) {
      console.error('Error deleting weight entry:', error);
      toast.error('Failed to delete weight entry');
      throw error;
    }
  };

  const getWeightStats = () => {
    if (data.entries.length === 0) return null;
    
    const currentWeight = data.entries[0]?.weight || 0;
    const firstEntry = data.entries[data.entries.length - 1];
    const totalChange = currentWeight - (firstEntry?.weight || currentWeight);
    
    // Calculate weekly change (last 7 entries or less)
    const weeklyEntries = data.entries.slice(0, 7);
    const weeklyChange = weeklyEntries.length > 1 
      ? weeklyEntries[0].weight - weeklyEntries[weeklyEntries.length - 1].weight 
      : 0;
    
    return {
      currentWeight,
      totalChange,
      weeklyChange,
      entryCount: data.entries.length
    };
  };

  useEffect(() => {
    fetchWeightEntries();
  }, [user]);

  return {
    ...data,
    weightEntries: data.entries, // Add this alias for backward compatibility
    addWeightEntry,
    deleteWeightEntry,
    getWeightStats,
    refetch: fetchWeightEntries
  };
};
