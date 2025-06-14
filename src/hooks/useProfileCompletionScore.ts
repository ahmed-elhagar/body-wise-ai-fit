
import { useProfile } from '@/hooks/useProfile';

export const useProfileCompletionScore = () => {
  const { profile, isLoading } = useProfile();

  const calculateCompletionScore = () => {
    if (!profile) return 0;
    
    const fields = [
      'age',
      'gender',
      'height',
      'weight',
      'activity_level',
      'health_goal',
      'dietary_preferences'
    ];
    
    const completedFields = fields.filter(field => 
      profile[field] && profile[field] !== null && profile[field] !== ''
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const score = calculateCompletionScore();
  const isComplete = score >= 80;

  return {
    score,
    isComplete,
    isLoading,
    completionScore: score // Add this alias for backward compatibility
  };
};
