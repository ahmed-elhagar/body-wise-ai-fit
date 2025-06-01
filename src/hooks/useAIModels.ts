
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
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AIModel[];
    },
  });

  // Fetch feature model assignments
  const { data: featureModels = [], isLoading: featureModelsLoading } = useQuery({
    queryKey: ['ai-feature-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_feature_models')
        .select(`
          *,
          primary_model:ai_models!primary_model_id(*),
          fallback_model:ai_models!fallback_model_id(*)
        `)
        .eq('is_active', true)
        .order('feature_name');

      if (error) throw error;
      return data as AIFeatureModel[];
    },
  });

  // Create new AI model
  const createModelMutation = useMutation({
    mutationFn: async (newModel: Omit<AIModel, 'id' | 'created_at' | 'updated_at'>) => {
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
      toast.error(`Failed to create AI model: ${error.message}`);
    },
  });

  // Update AI model
  const updateModelMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AIModel> & { id: string }) => {
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
      toast.error(`Failed to update AI model: ${error.message}`);
    },
  });

  // Update feature model assignment
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
      const { data, error } = await supabase
        .from('ai_feature_models')
        .update({
          primary_model_id,
          fallback_model_id,
        })
        .eq('feature_name', feature_name)
        .eq('is_active', true)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-feature-models'] });
      toast.success('Feature model assignment updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update feature model: ${error.message}`);
    },
  });

  return {
    models,
    featureModels,
    isLoading: modelsLoading || featureModelsLoading,
    createModel: createModelMutation.mutate,
    updateModel: updateModelMutation.mutate,
    updateFeatureModel: updateFeatureModelMutation.mutate,
    isCreating: createModelMutation.isPending,
    isUpdating: updateModelMutation.isPending || updateFeatureModelMutation.isPending,
  };
};
