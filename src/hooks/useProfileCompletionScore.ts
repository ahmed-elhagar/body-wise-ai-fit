
import { useProfile } from './useProfile';

export const useProfileCompletionScore = () => {
  const { profile } = useProfile();

  const calculateCompletionScore = () => {
    if (!profile) return 0;

    const fields = [
      profile.first_name,
      profile.last_name,
      profile.age,
      profile.gender,
      profile.height,
      profile.weight,
      profile.fitness_goal,
      profile.activity_level,
      profile.nationality,
      profile.body_shape
    ];

    const completedFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
    const totalFields = fields.length;

    return Math.round((completedFields / totalFields) * 100);
  };

  return {
    completionScore: calculateCompletionScore()
  };
};
