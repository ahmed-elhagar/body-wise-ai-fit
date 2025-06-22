
import { useState, useEffect } from 'react';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  cost_per_1k_tokens: number;
  max_tokens: number;
  context_window: number;
  is_active: boolean;
  is_default: boolean;
  description?: string;
  capabilities?: string[];
}

export interface FeatureModel {
  id: string;
  feature_name: string;
  primary_model_id: string;
  fallback_model_id?: string;
  primary_model?: AIModel;
  fallback_model?: AIModel;
}

export const useAIModels = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [featureModels, setFeatureModels] = useState<FeatureModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Mock data for now - replace with actual API calls
    setModels([
      {
        id: '1',
        name: 'GPT-4o Mini',
        provider: 'openai',
        model_id: 'gpt-4o-mini',
        cost_per_1k_tokens: 0.00015,
        max_tokens: 16384,
        context_window: 16384,
        is_active: true,
        is_default: true,
        description: 'Fast and efficient model for most tasks'
      }
    ]);
    
    setFeatureModels([]);
    setIsLoading(false);
  }, []);

  const createModel = (modelData: Partial<AIModel>) => {
    setIsUpdating(true);
    const newModel: AIModel = {
      id: Date.now().toString(),
      name: modelData.name || '',
      provider: modelData.provider || 'openai',
      model_id: modelData.model_id || '',
      cost_per_1k_tokens: modelData.cost_per_1k_tokens || 0,
      max_tokens: modelData.max_tokens || 4096,
      context_window: modelData.context_window || 4096,
      is_active: modelData.is_active ?? true,
      is_default: modelData.is_default ?? false,
      description: modelData.description
    };
    
    setModels(prev => [...prev, newModel]);
    setIsUpdating(false);
  };

  const updateModel = (updates: Partial<AIModel> & { id: string }) => {
    setIsUpdating(true);
    setModels(prev => prev.map(model => 
      model.id === updates.id ? { ...model, ...updates } : model
    ));
    setIsUpdating(false);
  };

  const deleteModel = (modelId: string) => {
    setIsUpdating(true);
    setModels(prev => prev.filter(model => model.id !== modelId));
    setIsUpdating(false);
  };

  const updateFeatureModel = (data: {
    feature_name: string;
    primary_model_id: string;
    fallback_model_id?: string;
  }) => {
    setIsUpdating(true);
    setFeatureModels(prev => {
      const existing = prev.find(fm => fm.feature_name === data.feature_name);
      if (existing) {
        return prev.map(fm => 
          fm.feature_name === data.feature_name 
            ? { ...fm, ...data }
            : fm
        );
      } else {
        return [...prev, {
          id: Date.now().toString(),
          ...data
        }];
      }
    });
    setIsUpdating(false);
  };

  return {
    models,
    featureModels,
    isLoading,
    isUpdating,
    createModel,
    updateModel,
    deleteModel,
    updateFeatureModel
  };
};
