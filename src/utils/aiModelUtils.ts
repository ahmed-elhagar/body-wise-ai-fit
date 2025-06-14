
import { supabase } from '@/integrations/supabase/client';

export interface AIModelConfig {
  modelId: string;
  provider: string;
  apiKey?: string;
}

/**
 * Get the configured AI model for a specific feature
 * This will be used in Phase 2 to abstract model selection
 */
export const getAIModelForFeature = async (featureName: string): Promise<AIModelConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_feature_models')
      .select(`
        primary_model:ai_models!primary_model_id(
          model_id,
          provider,
          is_active
        )
      `)
      .eq('feature_name', featureName)
      .eq('is_active', true)
      .single();

    if (error || !data?.primary_model) {
      console.warn(`No AI model configured for feature: ${featureName}, falling back to default`);
      return {
        modelId: 'gpt-4o-mini',
        provider: 'openai'
      };
    }

    const model = data.primary_model as any;
    
    if (!model.is_active) {
      console.warn(`Configured AI model is inactive for feature: ${featureName}, falling back to default`);
      return {
        modelId: 'gpt-4o-mini',
        provider: 'openai'
      };
    }

    return {
      modelId: model.model_id,
      provider: model.provider
    };
  } catch (error) {
    console.error('Error fetching AI model configuration:', error);
    // Fallback to default OpenAI model
    return {
      modelId: 'gpt-4o-mini',
      provider: 'openai'
    };
  }
};

/**
 * Get fallback model for a feature if primary fails
 */
export const getFallbackModelForFeature = async (featureName: string): Promise<AIModelConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('ai_feature_models')
      .select(`
        fallback_model:ai_models!fallback_model_id(
          model_id,
          provider,
          is_active
        )
      `)
      .eq('feature_name', featureName)
      .eq('is_active', true)
      .single();

    if (error || !data?.fallback_model) {
      return null;
    }

    const model = data.fallback_model as any;
    
    if (!model.is_active) {
      return null;
    }

    return {
      modelId: model.model_id,
      provider: model.provider
    };
  } catch (error) {
    console.error('Error fetching fallback AI model:', error);
    return null;
  }
};
