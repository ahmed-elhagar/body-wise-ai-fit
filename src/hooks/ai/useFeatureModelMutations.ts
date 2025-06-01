
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AIFeatureModel } from '@/types/aiModels';

export const useFeatureModelMutations = () => {
  const queryClient = useQueryClient();

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
    updateFeatureModel: updateFeatureModelMutation.mutate,
    isUpdatingFeatureModel: updateFeatureModelMutation.isPending,
  };
};
