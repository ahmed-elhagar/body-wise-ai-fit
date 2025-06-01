
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AIModel, AIFeatureModel } from '@/types/aiModels';

export const useAIModelQueries = () => {
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

  return {
    models,
    featureModels,
    isLoading: modelsLoading || featureModelsLoading,
  };
};
