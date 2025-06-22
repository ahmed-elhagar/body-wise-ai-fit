
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useFeatureModelMutations = () => {
  const queryClient = useQueryClient();

  const updateFeatureModel = useMutation({
    mutationFn: async ({ featureName, primaryModelId, fallbackModelId }: any) => {
      const { data, error } = await supabase
        .from('ai_feature_models')
        .upsert({
          feature_name: featureName,
          primary_model_id: primaryModelId,
          fallback_model_id: fallbackModelId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-feature-models'] });
    },
  });

  return {
    updateFeatureModel: updateFeatureModel.mutate,
    isUpdatingFeatureModel: updateFeatureModel.isPending,
  };
};
