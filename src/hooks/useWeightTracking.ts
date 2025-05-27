
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

  return {
    weightEntries: weightEntries || [],
    isLoading,
    error,
    addWeightEntry: addWeightEntry.mutate,
    isAdding: addWeightEntry.isPending,
  };
};
