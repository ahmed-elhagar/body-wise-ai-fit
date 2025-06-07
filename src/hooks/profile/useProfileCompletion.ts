
import { useProfile } from "../useProfile";
import { useHealthAssessment } from "../useHealthAssessment";
import type { ProfileFormData } from "./types";

export const useProfileCompletion = (formData: ProfileFormData) => {
  const { profile } = useProfile();
  const { assessment } = useHealthAssessment();

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 0;

    // Basic info fields (8 required)
    const basicFields = ['first_name', 'last_name', 'age', 'gender', 'height', 'weight', 'nationality', 'body_shape'];
    basicFields.forEach(field => {
      total++;
      if (formData[field as keyof ProfileFormData] && formData[field as keyof ProfileFormData] !== '') {
        completed++;
      }
    });

    // Goals fields (2 required)
    const goalFields = ['fitness_goal', 'activity_level'];
    goalFields.forEach(field => {
      total++;
      if (formData[field as keyof ProfileFormData] && formData[field as keyof ProfileFormData] !== '') {
        completed++;
      }
    });

    // Health assessment
    if (assessment) {
      total += 4; // Key assessment fields
      if (assessment.stress_level !== null) completed++;
      if (assessment.sleep_quality !== null) completed++;
      if (assessment.energy_level !== null) completed++;
      if (assessment.work_schedule) completed++;
    } else {
      total += 4;
    }

    return Math.round((completed / total) * 100);
  };

  return {
    completionPercentage: getCompletionPercentage(),
    assessment,
  };
};
