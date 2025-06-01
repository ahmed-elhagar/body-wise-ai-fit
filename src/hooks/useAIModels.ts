
import { useAIModelQueries } from './ai/useAIModelQueries';
import { useAIModelMutations } from './ai/useAIModelMutations';
import { useFeatureModelMutations } from './ai/useFeatureModelMutations';

export * from '@/types/aiModels';

export const useAIModels = () => {
  const { models, featureModels, isLoading } = useAIModelQueries();
  const { createModel, updateModel, deleteModel, isCreating, isUpdating, isDeleting } = useAIModelMutations();
  const { updateFeatureModel, isUpdatingFeatureModel } = useFeatureModelMutations();

  return {
    models,
    featureModels,
    isLoading,
    createModel,
    updateModel,
    deleteModel,
    updateFeatureModel,
    isCreating,
    isUpdating: isUpdating || isUpdatingFeatureModel,
    isDeleting,
  };
};
