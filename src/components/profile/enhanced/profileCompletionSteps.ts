
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { useLanguage } from "@/contexts/LanguageContext";

export const useProfileCompletionSteps = (completionScore: number) => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();
  const { progress } = useOnboardingProgress();
  const { t } = useLanguage();

  const steps = [
    {
      key: 'basic_info',
      title: t('basicInformation'),
      description: t('personalDetailsAndMeasurements'),
      completed: !!(profile?.first_name && 
                   profile?.last_name && 
                   profile?.age && 
                   profile?.gender && 
                   profile?.height && 
                   profile?.weight && 
                   profile?.nationality && 
                   profile?.body_shape),
    },
    {
      key: 'health_assessment',
      title: t('healthAssessment'),
      description: t('healthConditionsLifestyleData'),
      completed: !!(assessment && 
                   assessment.stress_level !== null && 
                   assessment.sleep_quality !== null && 
                   assessment.energy_level !== null &&
                   assessment.work_schedule && 
                   assessment.exercise_history &&
                   assessment.commitment_level !== null &&
                   assessment.nutrition_knowledge &&
                   assessment.cooking_skills &&
                   assessment.time_availability &&
                   assessment.timeline_expectation),
    },
    {
      key: 'goals_setup',
      title: t('goalsObjectives'),
      description: t('fitnessGoalsTargetAchievements'),
      completed: !!(profile?.fitness_goal && 
                   profile?.activity_level),
    },
    {
      key: 'preferences',
      title: t('preferences'),
      description: t('appSettingsNotificationPreferences'),
      completed: progress?.preferences_completed || false,
    },
    {
      key: 'profile_review',
      title: t('profileReview'),
      description: t('finalReviewConfirmation'),
      completed: completionScore >= 85,
    },
  ];

  const nextIncompleteStep = steps.find(step => !step.completed);
  const completedSteps = steps.filter(step => step.completed).length;

  return {
    steps,
    nextIncompleteStep,
    completedSteps,
  };
};
