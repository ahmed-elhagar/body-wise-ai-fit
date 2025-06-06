
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      // Basic Information - nationality is now optional
      return !!(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.age &&
        formData.gender
      );
    
    case 2:
      // Physical Information
      return !!(
        formData.height &&
        formData.weight
      );
    
    case 3:
      // Goals and Activity - all optional but at least fitness goal should be selected
      return !!(formData.fitness_goal && formData.activity_level);
    
    case 4:
      // Preferences - all optional
      return true;
    
    default:
      return false;
  }
};
