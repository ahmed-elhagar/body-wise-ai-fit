
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useWeightTracking = () => {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['weight-entries'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching weight entries:', error);
        throw error;
      }

      return data || [];
    },
  });

  const addWeightEntryMutation = useMutation({
    mutationFn: async (entryData: {
      weight: number;
      body_fat_percentage?: number;
      muscle_mass?: number;
      notes?: string;
      recorded_at: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('weight_entries')
        .insert({
          ...entryData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-entries'] });
      toast.success('Weight entry added successfully!');
    },
    onError: (error) => {
      console.error('Error adding weight entry:', error);
      toast.error('Failed to add weight entry');
    },
  });

  const latestEntry = entries.length > 0 ? entries[0] : null;

  const getWeightStats = () => {
    if (entries.length === 0) return null;

    const currentWeight = entries[0].weight;
    const previousWeight = entries.length > 1 ? entries[1].weight : currentWeight;
    const oldestWeight = entries[entries.length - 1].weight;

    // Calculate weekly change (comparing with entry from ~7 days ago)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoEntry = entries.find(entry => 
      new Date(entry.recorded_at) <= weekAgo
    );
    const weeklyChange = weekAgoEntry ? currentWeight - weekAgoEntry.weight : 0;

    return {
      currentWeight,
      weeklyChange,
      totalChange: currentWeight - oldestWeight,
      entryCount: entries.length,
    };
  };

  return {
    entries,
    isLoading,
    latestEntry,
    getWeightStats,
    addWeightEntry: addWeightEntryMutation.mutate,
    isAdding: addWeightEntryMutation.isPending,
  };
};
