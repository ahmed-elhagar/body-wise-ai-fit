
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { useLanguage } from "@/contexts/LanguageContext";

export const useProfileCompletionSteps = (completionScore: number) => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();
  const { progress } = useOnboardingProgress();
  const { t } = useLanguage();

  const isBasicInfoComplete = !!(profile?.first_name && 
                                profile?.last_name && 
                                profile?.age && 
                                profile?.gender && 
                                profile?.height && 
                                profile?.weight && 
                                profile?.nationality && 
                                profile?.body_shape);

  // Fixed: Proper health assessment completion check
  const isHealthAssessmentComplete = !!(assessment && 
                                       assessment.stress_level && 
                                       assessment.sleep_quality && 
                                       assessment.energy_level &&
                                       assessment.work_schedule && 
                                       assessment.exercise_history &&
                                       assessment.commitment_level &&
                                       assessment.nutrition_knowledge &&
                                       assessment.cooking_skills &&
                                       assessment.time_availability &&
                                       assessment.timeline_expectation);

  const isGoalsComplete = !!(profile?.fitness_goal && 
                            profile?.activity_level);

  const isPreferencesComplete = progress?.preferences_completed || false;

  // Only 3 steps now (removed profile review)
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
      completed: isHealthAssessmentComplete,
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
    isHealthAssessmentComplete,
    isGoalsComplete,
    isPreferencesComplete,
    completionScore,
    steps: steps.map(s => ({ key: s.key, completed: s.completed })),
    nextIncompleteStep: nextIncompleteStep?.key,
    completedSteps,
    assessmentExists: !!assessment,
    assessmentData: assessment ? {
      stress_level: assessment.stress_level,
      sleep_quality: assessment.sleep_quality,
      energy_level: assessment.energy_level,
      work_schedule: assessment.work_schedule,
      exercise_history: assessment.exercise_history,
      commitment_level: assessment.commitment_level,
      nutrition_knowledge: assessment.nutrition_knowledge,
      cooking_skills: assessment.cooking_skills,
      time_availability: assessment.time_availability,
      timeline_expectation: assessment.timeline_expectation
    } : null
  });

  return {
    steps,
    nextIncompleteStep,
    completedSteps,
  };
};
