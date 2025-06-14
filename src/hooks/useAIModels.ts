
import { useState, useEffect } from 'react';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  model_id: string;
  capabilities: string[];
  cost_per_1k_tokens: number;
  max_tokens: number;
  context_window: number;
  description: string;
  is_active: boolean;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FeatureModel {
  id: string;
  feature_name: string;
  primary_model_id: string;
  fallback_model_id?: string;
  primary_model?: AIModel;
  fallback_model?: AIModel;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useAIModels = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [featureModels, setFeatureModels] = useState<FeatureModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setModels([
        {
          id: '1',
          name: 'GPT-4',
          provider: 'openai',
          model_id: 'gpt-4',
          capabilities: ['text', 'chat'],
          cost_per_1k_tokens: 0.03,
          max_tokens: 4096,
          context_window: 4096,
          description: 'Most capable GPT-4 model',
          is_active: true,
          is_default: true
        },
        {
          id: '2',
          name: 'Claude 3',
          provider: 'anthropic',
          model_id: 'claude-3-sonnet-20240229',
          capabilities: ['text', 'chat'],
          cost_per_1k_tokens: 0.003,
          max_tokens: 4096,
          context_window: 4096,
          description: 'Anthropic Claude 3 Sonnet',
          is_active: true,
          is_default: false
        }
      ]);

      setFeatureModels([
        {
          id: '1',
          feature_name: 'meal_plan',
          primary_model_id: '1',
          is_active: true
        },
        {
          id: '2',
          feature_name: 'chat',
          primary_model_id: '2',
          is_active: true
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const createModel = async (modelData: Partial<AIModel>) => {
    setIsUpdating(true);
    try {
      const newModel: AIModel = {
        id: Date.now().toString(),
        ...modelData
      } as AIModel;
      setModels(prev => [...prev, newModel]);
    } catch (error) {
      console.error('Error creating model:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateModel = async (modelData: Partial<AIModel> & { id: string }) => {
    setIsUpdating(true);
    try {
      setModels(prev => prev.map(model => 
        model.id === modelData.id ? { ...model, ...modelData } : model
      ));
    } catch (error) {
      console.error('Error updating model:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteModel = async (modelId: string) => {
    setIsUpdating(true);
    try {
      setModels(prev => prev.filter(model => model.id !== modelId));
    } catch (error) {
      console.error('Error deleting model:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateFeatureModel = async (featureData: Partial<FeatureModel>) => {
    setIsUpdating(true);
    try {
      setFeatureModels(prev => {
        const existing = prev.find(fm => fm.feature_name === featureData.feature_name);
        if (existing) {
          return prev.map(fm => 
            fm.feature_name === featureData.feature_name 
              ? { ...fm, ...featureData }
              : fm
          );
        } else {
          return [...prev, {
            id: Date.now().toString(),
            ...featureData
          } as FeatureModel];
        }
      });
    } catch (error) {
      console.error('Error updating feature model:', error);
    } finally {
      setIsUpdating(false);
    }
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
