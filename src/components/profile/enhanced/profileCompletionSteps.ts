import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { useI18n } from "@/hooks/useI18n";

export const useProfileCompletionSteps = (completionScore: number) => {
  const { profile } = useProfile();
  const { assessment, isAssessmentComplete } = useHealthAssessment();
  const { progress } = useOnboardingProgress();
  const { t } = useI18n();

  const isBasicInfoComplete = !!(profile?.first_name && 
                                profile?.last_name && 
                                profile?.age && 
                                profile?.gender && 
                                profile?.height && 
                                profile?.weight && 
                                profile?.nationality && 
                                profile?.body_shape);

  const isGoalsComplete = !!(profile?.fitness_goal && 
                            profile?.activity_level);

  const isPreferencesComplete = progress?.preferences_completed || false;

  // Only 4 steps now (removed profile review)
  const steps = [
    {
      key: 'basic_info',
      title: t('basicInformation') || 'Basic Information',
      description: t('personalDetailsAndMeasurements') || 'Personal details and measurements',
      completed: isBasicInfoComplete,
    },
    {
      key: 'health_assessment',
      title: t('healthAssessment') || 'Health Assessment',
      description: t('healthConditionsLifestyleData') || 'Health conditions and lifestyle data',
      completed: isAssessmentComplete,
    },
    {
      key: 'goals_setup',
      title: t('goalsObjectives') || 'Goals & Objectives',
      description: t('fitnessGoalsTargetAchievements') || 'Fitness goals and target achievements',
      completed: isGoalsComplete,
    },
    {
      key: 'preferences',
      title: t('preferences') || 'Preferences',
      description: t('appSettingsNotificationPreferences') || 'App settings and notification preferences',
      completed: isPreferencesComplete,
    },
  ];

  const nextIncompleteStep = steps.find(step => !step.completed);
  const completedSteps = steps.filter(step => step.completed).length;

  console.log('Profile completion steps analysis:', {
    isBasicInfoComplete,
    isHealthAssessmentComplete: isAssessmentComplete,
    isGoalsComplete,
    isPreferencesComplete,
    completionScore,
    steps: steps.map(s => ({ key: s.key, completed: s.completed })),
    nextIncompleteStep: nextIncompleteStep?.key,
    completedSteps,
    assessmentExists: !!assessment,
    assessmentComplete: isAssessmentComplete,
  });

  return {
    steps,
    nextIncompleteStep,
    completedSteps,
  };
};
