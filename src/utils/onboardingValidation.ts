
import { OnboardingFormData } from '@/hooks/useOnboardingForm';

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      // Basic Info - All required
      return Boolean(
        formData.first_name && 
        formData.last_name && 
        formData.age && 
        formData.gender && 
        formData.nationality
      );
    case 2:
      // Physical Info - All required
      return Boolean(
        formData.height && 
        formData.weight
      );
    case 3:
      // Goals - Required fields
      return Boolean(
        formData.fitness_goal && 
        formData.activity_level
      );
    case 4:
      // Preferences - All optional
      return true;
    default:
      return false;
  }
};
