
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAIModelQueries = () => {
  const { data: models, isLoading: isLoadingModels } = useQuery({
    queryKey: ['ai-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: featureModels, isLoading: isLoadingFeatureModels } = useQuery({
    queryKey: ['ai-feature-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_feature_models')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  return {
    models: models || [],
    featureModels: featureModels || [],
    isLoading: isLoadingModels || isLoadingFeatureModels,
  };
};
