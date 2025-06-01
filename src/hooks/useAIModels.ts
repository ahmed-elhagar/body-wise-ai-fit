
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  capabilities: string[];
  cost_per_1k_tokens: number;
  max_tokens: number;
  context_window: number;
  is_active: boolean;
  is_default: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AIFeatureModel {
  id: string;
  feature_name: string;
  primary_model_id: string;
  fallback_model_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  primary_model?: AIModel;
  fallback_model?: AIModel;
}

export const useAIModels = () => {
  const queryClient = useQueryClient();

  // Fetch all AI models
  const { data: models = [], isLoading: modelsLoading } = useQuery({
    queryKey: ['ai-models'],
    queryFn: async () => {
      console.log('🔍 Fetching AI models...');
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching AI models:', error);
        throw error;
      }
      
      console.log('✅ AI models fetched:', data.length);
      return data as AIModel[];
    },
  });

  // Fetch feature model assignments
  const { data: featureModels = [], isLoading: featureModelsLoading } = useQuery({
    queryKey: ['ai-feature-models'],
    queryFn: async () => {
      console.log('🔍 Fetching feature model assignments...');
      const { data, error } = await supabase
        .from('ai_feature_models')
        .select(`
          *,
          primary_model:ai_models!primary_model_id(*),
          fallback_model:ai_models!fallback_model_id(*)
        `)
        .eq('is_active', true)
        .order('feature_name');

      if (error) {
        console.error('❌ Error fetching feature models:', error);
        throw error;
      }
      
      console.log('✅ Feature models fetched:', data.length);
      return data as AIFeatureModel[];
    },
  });

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

  // Update feature model assignment with better error handling and immediate UI feedback
  const updateFeatureModelMutation = useMutation({
    mutationFn: async ({ 
      feature_name, 
      primary_model_id, 
      fallback_model_id 
    }: {
      feature_name: string;
      primary_model_id: string;
      fallback_model_id?: string;
    }) => {
      console.log('🔄 Updating feature model assignment:', { feature_name, primary_model_id, fallback_model_id });
      
      // First try to update existing assignment
      const { data: existingData, error: selectError } = await supabase
        .from('ai_feature_models')
        .select('id')
        .eq('feature_name', feature_name)
        .eq('is_active', true)
        .maybeSingle();

      if (selectError) {
        console.error('❌ Error checking existing assignment:', selectError);
        throw selectError;
      }

      let result;
      if (existingData) {
        // Update existing assignment
        const { data, error } = await supabase
          .from('ai_feature_models')
          .update({
            primary_model_id,
            fallback_model_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select(`
            *,
            primary_model:ai_models!primary_model_id(*),
            fallback_model:ai_models!fallback_model_id(*)
          `)
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new assignment
        const { data, error } = await supabase
          .from('ai_feature_models')
          .insert({
            feature_name,
            primary_model_id,
            fallback_model_id,
            is_active: true
          })
          .select(`
            *,
            primary_model:ai_models!primary_model_id(*),
            fallback_model:ai_models!fallback_model_id(*)
          `)
          .single();

        if (error) throw error;
        result = data;
      }

      console.log('✅ Feature model assignment updated:', result);
      return result;
    },
    onSuccess: (data) => {
      // Immediately update the cache to reflect the change
      queryClient.setQueryData(['ai-feature-models'], (oldData: AIFeatureModel[] = []) => {
        const newData = oldData.filter(item => item.feature_name !== data.feature_name);
        return [...newData, data];
      });
      
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['ai-feature-models'] });
      
      const modelName = data.primary_model?.name || 'Unknown Model';
      toast.success(`Feature "${data.feature_name}" assigned to ${modelName}`);
    },
    onError: (error: any) => {
      console.error('❌ Failed to update feature model assignment:', error);
      toast.error(`Failed to update assignment: ${error.message}`);
    },
  });

  return {
    models,
    featureModels,
    isLoading: modelsLoading || featureModelsLoading,
    createModel: createModelMutation.mutate,
    updateModel: updateModelMutation.mutate,
    deleteModel: deleteModelMutation.mutate,
    updateFeatureModel: updateFeatureModelMutation.mutate,
    isCreating: createModelMutation.isPending,
    isUpdating: updateModelMutation.isPending || updateFeatureModelMutation.isPending,
    isDeleting: deleteModelMutation.isPending,
  };
};
