
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

export const useProfileCompletionScore = () => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();
  const { progress } = useOnboardingProgress();

  const calculateCompletionScore = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Basic Information (8 required fields) - Weight: 40%
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value !== null && value !== undefined && value !== '') {
        completedFields++;
      }
    });

    // Goals & Activity (2 required fields) - Weight: 20%
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value && value !== '') {
        completedFields++;
      }
    });

    // Health Assessment (10 key required fields) - Weight: 30%
    const healthAssessmentFields = [
      'stress_level', 'sleep_quality', 'energy_level', 'work_schedule',
      'exercise_history', 'nutrition_knowledge', 'cooking_skills', 'time_availability',
      'timeline_expectation', 'commitment_level'
    ];
    
    healthAssessmentFields.forEach(field => {
      totalFields++;
      if (assessment) {
        const value = assessment[field as keyof typeof assessment];
        if (value !== null && value !== undefined && value !== '' && value !== 0) {
          completedFields++;
        }
      }
    });

    // Preferences - Weight: 10%
    totalFields += 1;
    if (progress?.preferences_completed) completedFields++;

    const score = Math.round((completedFields / totalFields) * 100);
    
    console.log('Profile completion score calculation:', {
      completedFields,
      totalFields,
      score,
      hasProfile: !!profile,
      hasAssessment: !!assessment,
      hasProgress: !!progress,
      assessmentData: assessment ? {
        stress_level: assessment.stress_level,
        sleep_quality: assessment.sleep_quality,
        energy_level: assessment.energy_level,
        work_schedule: assessment.work_schedule,
        exercise_history: assessment.exercise_history,
        nutrition_knowledge: assessment.nutrition_knowledge,
        cooking_skills: assessment.cooking_skills,
        time_availability: assessment.time_availability,
        timeline_expectation: assessment.timeline_expectation,
        commitment_level: assessment.commitment_level
      } : null
    });
    
    return score;
  };

  return {
    completionScore: calculateCompletionScore(),
  };
};
