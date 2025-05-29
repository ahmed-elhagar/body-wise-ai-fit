
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

    // Basic Information (8 required fields)
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value !== null && value !== undefined && value !== '') {
        completedFields++;
      }
    });

    // Goals & Activity (6 fields - 2 required + 4 array fields)
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value && value !== '') {
        completedFields++;
      }
    });
    
    // Array fields for profile
    const arrayFields = ['health_conditions', 'allergies', 'preferred_foods', 'dietary_restrictions'];
    arrayFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile] as string[];
      if (value && Array.isArray(value) && value.length > 0) {
        completedFields++;
      }
    });

    // Health Assessment (key fields)
    const healthAssessmentFields = [
      'stress_level', 'sleep_quality', 'energy_level', 'work_schedule',
      'exercise_history', 'nutrition_knowledge', 'cooking_skills', 'time_availability',
      'timeline_expectation', 'commitment_level'
    ];
    
    healthAssessmentFields.forEach(field => {
      totalFields++;
      if (assessment) {
        const value = assessment[field as keyof typeof assessment];
        if (value !== null && value !== undefined && value !== '') {
          completedFields++;
        }
      }
    });

    // Assessment array fields
    const assessmentArrayFields = ['chronic_conditions', 'medications', 'primary_motivation', 'specific_goals'];
    assessmentArrayFields.forEach(field => {
      totalFields++;
      if (assessment) {
        const value = assessment[field as keyof typeof assessment] as string[];
        if (value && Array.isArray(value) && value.length > 0) {
          completedFields++;
        }
      }
    });

    // Onboarding progress fields
    totalFields += 2; // preferences_completed, profile_review_completed
    if (progress?.preferences_completed) completedFields++;
    if (progress?.profile_review_completed) completedFields++;

    const score = Math.round((completedFields / totalFields) * 100);
    console.log('Profile completion calculation:', {
      completedFields,
      totalFields,
      score,
      profile: !!profile,
      assessment: !!assessment,
      progress: !!progress
    });
    
    return score;
  };

  return {
    completionScore: calculateCompletionScore(),
  };
};
