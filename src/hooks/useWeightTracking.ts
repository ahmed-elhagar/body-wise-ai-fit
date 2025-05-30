
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  recorded_at: string;
  notes?: string;
}

export const useWeightTracking = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: weightEntries, isLoading, error } = useQuery({
    queryKey: ['weight-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('No user ID available for weight entries');
        return [];
      }
      
      console.log('Fetching weight entries for user:', user.id);
      
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) {
        console.error('Weight entries fetch error:', error);
        throw error;
      }
      
      console.log('Weight entries data:', data);
      return data as WeightEntry[];
    },
    enabled: !!user?.id,
  });

  const addWeightEntry = useMutation({
    mutationFn: async (entryData: Omit<WeightEntry, 'id' | 'user_id'>) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('weight_entries')
        .insert({
          user_id: user.id,
          ...entryData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries', user?.id] });
      toast.success('Weight entry added successfully!');
    },
    onError: (error) => {
      console.error('Weight entry error:', error);
      toast.error('Failed to add weight entry');
    },
  });

  const updateWeightEntry = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<WeightEntry> & { id: string }) => {
      if (!user?.id) throw new Error('No user ID');

      const { data, error } = await supabase
        .from('weight_entries')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries', user?.id] });
      toast.success('Weight entry updated successfully!');
    },
    onError: (error) => {
      console.error('Weight entry update error:', error);
      toast.error('Failed to update weight entry');
    },
  });

  const deleteWeightEntry = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('No user ID');

      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries', user?.id] });
      toast.success('Weight entry deleted successfully!');
    },
    onError: (error) => {
      console.error('Weight entry delete error:', error);
      toast.error('Failed to delete weight entry');
    },
  });

  // Get weight statistics
  const getWeightStats = () => {
    if (!weightEntries || weightEntries.length === 0) return null;

    const latest = weightEntries[0];
    const oldest = weightEntries[weightEntries.length - 1];
    const totalChange = latest.weight - oldest.weight;
    
    // Calculate weekly trend (last 7 entries or 7 days)
    const weekAgoEntry = weightEntries.find(entry => {
      const entryDate = new Date(entry.recorded_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate <= weekAgo;
    });
    
    const weeklyChange = weekAgoEntry ? latest.weight - weekAgoEntry.weight : 0;
    
    // Calculate average weight
    const avgWeight = weightEntries.reduce((sum, entry) => sum + entry.weight, 0) / weightEntries.length;

    return {
      currentWeight: latest.weight,
      totalChange,
      weeklyChange,
      avgWeight,
      entryCount: weightEntries.length,
      latestEntry: latest,
      oldestEntry: oldest,
    };
  };

  return {
    weightEntries: weightEntries || [],
    isLoading,
    error,
    addWeightEntry: addWeightEntry.mutate,
    updateWeightEntry: updateWeightEntry.mutate,
    deleteWeightEntry: deleteWeightEntry.mutate,
    isAdding: addWeightEntry.isPending,
    isUpdating: updateWeightEntry.isPending,
    isDeleting: deleteWeightEntry.isPending,
    getWeightStats,
  };
};
