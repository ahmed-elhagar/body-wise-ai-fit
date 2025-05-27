
import { OnboardingFormData } from '@/hooks/useOnboardingForm';

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      return Boolean(
        formData.first_name && 
        formData.last_name && 
        formData.age && 
        formData.gender && 
        formData.height && 
        formData.weight && 
        formData.nationality && 
        formData.body_shape
      );
    case 2:
      return Boolean(formData.fitness_goal && formData.activity_level);
    case 3:
      return true; // Optional step
    default:
      return false;
  }
};
