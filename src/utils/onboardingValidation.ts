
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      // Basic Information - all fields required except nationality
      return !!(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight
      );
    
    case 2:
      // Body shape and motivation - body shape is optional
      return true; // This step is optional
    
    case 3:
      // Goals and activity - fitness goal and activity level required
      return !!(formData.fitness_goal && formData.activity_level);
    
    case 4:
      // Summary - always valid as it's a review step
      return true;
    
    default:
      return false;
  }
};
