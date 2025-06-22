
import { Language } from '@/contexts/LanguageContext';
import { useI18n } from '@/shared/hooks/useI18n';

export const translateExerciseName = (exerciseName: string): string => {
  const { t } = useI18n();
  
  // Common exercise translations
  const exerciseTranslations: Record<string, string> = {
    'push ups': t('exercise.names.pushUps'),
    'pull ups': t('exercise.names.pullUps'),
    'squats': t('exercise.names.squats'),
    'lunges': t('exercise.names.lunges'),
    'plank': t('exercise.names.plank'),
    'burpees': t('exercise.names.burpees'),
    'jumping jacks': t('exercise.names.jumpingJacks'),
    'mountain climbers': t('exercise.names.mountainClimbers'),
    'bicycle crunches': t('exercise.names.bicycleCrunches'),
    'deadlifts': t('exercise.names.deadlifts'),
    'bench press': t('exercise.names.benchPress'),
    'shoulder press': t('exercise.names.shoulderPress'),
  };
  
  const lowerCaseName = exerciseName.toLowerCase();
  return exerciseTranslations[lowerCaseName] || exerciseName;
};

export const translateMuscleGroup = (muscleGroup: string): string => {
  const { t } = useI18n();
  
  const muscleGroupTranslations: Record<string, string> = {
    'chest': t('exercise.muscleGroups.chest'),
    'back': t('exercise.muscleGroups.back'),
    'shoulders': t('exercise.muscleGroups.shoulders'),
    'arms': t('exercise.muscleGroups.arms'),
    'legs': t('exercise.muscleGroups.legs'),
    'core': t('exercise.muscleGroups.core'),
    'cardio': t('exercise.muscleGroups.cardio'),
    'full body': t('exercise.muscleGroups.fullBody'),
  };
  
  const lowerCaseGroup = muscleGroup.toLowerCase();
  return muscleGroupTranslations[lowerCaseGroup] || muscleGroup;
};

export const translateEquipment = (equipment: string): string => {
  const { t } = useI18n();
  
  const equipmentTranslations: Record<string, string> = {
    'bodyweight': t('exercise.equipment.bodyweight'),
    'dumbbells': t('exercise.equipment.dumbbells'),
    'barbell': t('exercise.equipment.barbell'),
    'resistance bands': t('exercise.equipment.resistanceBands'),
    'yoga mat': t('exercise.equipment.yogaMat'),
    'pull up bar': t('exercise.equipment.pullUpBar'),
    'kettlebell': t('exercise.equipment.kettlebell'),
  };
  
  const lowerCaseEquipment = equipment.toLowerCase();
  return equipmentTranslations[lowerCaseEquipment] || equipment;
};

// New function to translate entire exercise content
export const translateExerciseContent = (exercise: any, language: Language) => {
  const { t } = useI18n();
  
  return {
    ...exercise,
    name: translateExerciseName(exercise.name),
    instructions: exercise.instructions, // Keep original instructions for now
    muscle_groups: exercise.muscle_groups?.map((muscle: string) => translateMuscleGroup(muscle)),
    equipment: exercise.equipment ? translateEquipment(exercise.equipment) : exercise.equipment,
    youtube_search_term: exercise.youtube_search_term || exercise.name
  };
};
