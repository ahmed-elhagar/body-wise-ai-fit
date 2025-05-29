
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

    // Basic Information (8 required fields) - Weight: 25%
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value !== null && value !== undefined && value !== '') {
        completedFields++;
      }
    });

    // Goals & Activity (2 required + 4 optional array fields) - Weight: 15%
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value && value !== '') {
        completedFields++;
      }
    });
    
    // Optional array fields for profile (less weight)
    const arrayFields = ['health_conditions', 'allergies', 'preferred_foods', 'dietary_restrictions'];
    arrayFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile] as string[];
      if (value && Array.isArray(value) && value.length > 0) {
        completedFields++;
      }
    });

    // Health Assessment (key required fields) - Weight: 40%
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

    // Assessment optional array fields (less weight)
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

    // Onboarding progress fields - Weight: 20%
    totalFields += 2; // preferences_completed, profile_review_completed
    if (progress?.preferences_completed) completedFields++;
    if (progress?.profile_review_completed) completedFields++;

    const score = Math.round((completedFields / totalFields) * 100);
    
    console.log('Profile completion calculation details:', {
      completedFields,
      totalFields,
      score,
      hasProfile: !!profile,
      hasAssessment: !!assessment,
      hasProgress: !!progress,
      basicInfo: basicFields.map(field => ({
        field,
        value: profile?.[field as keyof typeof profile],
        completed: profile?.[field as keyof typeof profile] !== null && 
                  profile?.[field as keyof typeof profile] !== undefined && 
                  profile?.[field as keyof typeof profile] !== ''
      })),
      healthAssessment: healthAssessmentFields.map(field => ({
        field,
        value: assessment?.[field as keyof typeof assessment],
        completed: assessment && 
                  assessment[field as keyof typeof assessment] !== null && 
                  assessment[field as keyof typeof assessment] !== undefined && 
                  assessment[field as keyof typeof assessment] !== ''
      }))
    });
    
    return score;
  };

  return {
    completionScore: calculateCompletionScore(),
  };
};
