
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AIModel } from '@/types/aiModels';

export const useAIModelMutations = () => {
  const queryClient = useQueryClient();

  // Create new AI model
  const createModelMutation = useMutation({
    mutationFn: async (newModel: Omit<AIModel, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('🆕 Creating new AI model:', newModel);
      const { data, error } = await supabase
        .from('ai_models')
        .insert(newModel)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast.success('AI model created successfully');
    },
    onError: (error: any) => {
      console.error('❌ Failed to create AI model:', error);
      toast.error(`Failed to create AI model: ${error.message}`);
    },
  });

  // Update AI model
  const updateModelMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AIModel> & { id: string }) => {
      console.log('🔄 Updating AI model:', id, updates);
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
      toast.success('AI model updated successfully');
    },
    onError: (error: any) => {
      console.error('❌ Failed to update AI model:', error);
      toast.error(`Failed to update AI model: ${error.message}`);
    },
  });

  // Delete AI model
  const deleteModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      console.log('🗑️ Deleting AI model:', modelId);
      
      // First check if model is being used by any features
      const { data: usedByFeatures, error: checkError } = await supabase
        .from('ai_feature_models')
        .select('feature_name')
        .or(`primary_model_id.eq.${modelId},fallback_model_id.eq.${modelId}`)
        .eq('is_active', true);

      if (checkError) throw checkError;

      if (usedByFeatures && usedByFeatures.length > 0) {
        const featureNames = usedByFeatures.map(f => f.feature_name).join(', ');
        throw new Error(`Cannot delete model: currently assigned to features: ${featureNames}`);
      }

      const { error } = await supabase
        .from('ai_models')
        .delete()
        .eq('id', modelId);

      if (error) throw error;
      return modelId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-models'] });
      toast.success('AI model deleted successfully');
    },
    onError: (error: any) => {
      console.error('❌ Failed to delete AI model:', error);
      toast.error(`Failed to delete AI model: ${error.message}`);
    },
  });

  return {
    createModel: createModelMutation.mutate,
    updateModel: updateModelMutation.mutate,
    deleteModel: deleteModelMutation.mutate,
    isCreating: createModelMutation.isPending,
    isUpdating: updateModelMutation.isPending,
    isDeleting: deleteModelMutation.isPending,
  };
};
