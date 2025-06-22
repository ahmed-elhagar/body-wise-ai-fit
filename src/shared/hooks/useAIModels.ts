import { useState, useEffect } from 'react';

interface AIModel {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  lastUpdated: string;
  requestsToday: number;
  averageResponseTime: number;
}

interface AIModelsState {
  models: AIModel[];
  loading: boolean;
  error: string | null;
}

export const useAIModels = () => {
  const [state, setState] = useState<AIModelsState>({
    models: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Mock data - replace with actual API call
        const mockModels: AIModel[] = [
          {
            id: '1',
            name: 'Meal Plan Generator',
            version: 'v2.1.0',
            status: 'active',
            accuracy: 94.5,
            lastUpdated: '2024-01-15',
            requestsToday: 1247,
            averageResponseTime: 2.3
          },
          {
            id: '2',
            name: 'Exercise Recommender',
            version: 'v1.8.2',
            status: 'active',
            accuracy: 91.2,
            lastUpdated: '2024-01-14',
            requestsToday: 856,
            averageResponseTime: 1.8
          },
          {
            id: '3',
            name: 'Nutrition Analyzer',
            version: 'v1.5.1',
            status: 'training',
            accuracy: 87.9,
            lastUpdated: '2024-01-13',
            requestsToday: 423,
            averageResponseTime: 3.1
          }
        ];

        setTimeout(() => {
          setState({
            models: mockModels,
            loading: false,
            error: null
          });
        }, 1000);
      } catch (error) {
        setState({
          models: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch AI models'
        });
      }
    };

    fetchModels();
  }, []);

  const updateModelStatus = (modelId: string, status: AIModel['status']) => {
    setState(prev => ({
      ...prev,
      models: prev.models.map(model =>
        model.id === modelId ? { ...model, status } : model
      )
    }));
  };

  return {
    ...state,
    updateModelStatus
  };
};
