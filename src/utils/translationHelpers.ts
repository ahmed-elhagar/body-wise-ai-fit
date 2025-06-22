
import { useI18n } from '@/shared/hooks/useI18n';

export const getErrorMessage = (error: any): string => {
  const { t } = useI18n();
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    // Map common error messages to translation keys
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return t('errors.networkError');
    }
    
    if (message.includes('auth') || message.includes('unauthorized')) {
      return t('errors.authenticationRequired');
    }
    
    if (message.includes('credit') || message.includes('limit')) {
      return t('errors.insufficientCredits');
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return t('errors.validationError');
    }
    
    return error.message;
  }
  
  return t('errors.unknownError');
};

export const getMealTypeTranslation = (mealType: string): string => {
  const { t } = useI18n();
  
  const mealTypeMap: Record<string, string> = {
    breakfast: t('mealPlan.mealTypes.breakfast'),
    lunch: t('mealPlan.mealTypes.lunch'),
    dinner: t('mealPlan.mealTypes.dinner'),
    snack: t('mealPlan.mealTypes.snack1'),
    snack1: t('mealPlan.mealTypes.snack1'),
    snack2: t('mealPlan.mealTypes.snack2'),
  };
  
  return mealTypeMap[mealType] || mealType;
};

export const getExerciseDifficultyTranslation = (difficulty: string): string => {
  const { t } = useI18n();
  
  const difficultyMap: Record<string, string> = {
    beginner: t('exercise.difficulty.beginner'),
    intermediate: t('exercise.difficulty.intermediate'),
    advanced: t('exercise.difficulty.advanced'),
  };
  
  return difficultyMap[difficulty] || difficulty;
};

export const getWorkoutTypeTranslation = (workoutType: string): string => {
  const { t } = useI18n();
  
  const workoutTypeMap: Record<string, string> = {
    home: t('exercise.workoutType.home'),
    gym: t('exercise.workoutType.gym'),
    outdoor: t('exercise.workoutType.outdoor'),
  };
  
  return workoutTypeMap[workoutType] || workoutType;
};

export const getStatusTranslation = (status: string): string => {
  const { t } = useI18n();
  
  const statusMap: Record<string, string> = {
    active: t('common.status.active'),
    inactive: t('common.status.inactive'),
    completed: t('common.status.completed'),
    pending: t('common.status.pending'),
  };
  
  return statusMap[status] || status;
};

// New function for meal plan translations
export const useMealPlanTranslation = () => {
  const { t } = useI18n();
  
  const mealPlanT = (key: string): string => {
    return t(`mealPlan.${key}`);
  };
  
  return { mealPlanT };
};
