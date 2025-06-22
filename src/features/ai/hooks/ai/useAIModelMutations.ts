
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAIModelMutations = () => {
  const queryClient = useQueryClient();

  const createModel = useMutation({
    mutationFn: async (modelData: any) => {
      const { data, error } = await supabase
        .from('ai_models')
        .insert(modelData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
    },
  });

  const updateModel = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('ai_models')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
    },
  });

  const deleteModel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ai_models')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
    },
  });

  return {
    createModel: createModel.mutate,
    updateModel: updateModel.mutate,
    deleteModel: deleteModel.mutate,
    isCreating: createModel.isPending,
    isUpdating: updateModel.isPending,
    isDeleting: deleteModel.isPending,
  };
};
