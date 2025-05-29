
import { useProfile } from "@/hooks/useProfile";
import { useHealthAssessment } from "@/hooks/useHealthAssessment";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

interface CompletionBreakdown {
  basicInfo: { completed: number; total: number; fields: string[] };
  goals: { completed: number; total: number; fields: string[] };
  healthAssessment: { completed: number; total: number; fields: string[] };
  preferences: { completed: number; total: number };
}

export const useProfileCompletionScore = () => {
  const { profile } = useProfile();
  const { assessment, isAssessmentComplete } = useHealthAssessment();
  const { progress } = useOnboardingProgress();

  const calculateCompletionScore = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Basic Information (8 required fields) - Weight: 40%
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    const completedBasicFields: string[] = [];
    
    basicFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value !== null && value !== undefined && value !== '') {
        completedFields++;
        completedBasicFields.push(field);
      }
    });

    // Goals & Activity (2 required fields) - Weight: 20%
    const goalFields = ['fitness_goal', 'activity_level'];
    const completedGoalFields: string[] = [];
    
    goalFields.forEach(field => {
      totalFields++;
      const value = profile?.[field as keyof typeof profile];
      if (value && value !== '') {
        completedFields++;
        completedGoalFields.push(field);
      }
    });

    // Health Assessment (using the complete check from the hook) - Weight: 30%
    totalFields++;
    if (isAssessmentComplete) {
      completedFields++;
    }

    // Preferences - Weight: 10%
    totalFields++;
    if (progress?.preferences_completed) {
      completedFields++;
    }

    const score = Math.round((completedFields / totalFields) * 100);
    
    const breakdown: CompletionBreakdown = {
      basicInfo: {
        completed: completedBasicFields.length,
        total: basicFields.length,
        fields: completedBasicFields,
      },
      goals: {
        completed: completedGoalFields.length,
        total: goalFields.length,
        fields: completedGoalFields,
      },
      healthAssessment: {
        completed: isAssessmentComplete ? 1 : 0,
        total: 1,
        fields: isAssessmentComplete ? ['health_assessment'] : [],
      },
      preferences: {
        completed: progress?.preferences_completed ? 1 : 0,
        total: 1,
      },
    };
    
    console.log('Profile completion score calculation:', {
      score,
      completedFields,
      totalFields,
      breakdown,
      assessmentComplete: isAssessmentComplete,
      hasProfile: !!profile,
      hasAssessment: !!assessment,
      hasProgress: !!progress,
    });
    
    return { score, breakdown };
  };

  const { score, breakdown } = calculateCompletionScore();

  return {
    completionScore: score,
    breakdown,
  };
};
