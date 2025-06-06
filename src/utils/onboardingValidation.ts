
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
      // Body composition - body fat percentage is set by the slider
      return !!(formData.body_fat_percentage);
    
    case 3:
      // Goals and health - fitness goal and activity level required
      return !!(formData.fitness_goal && formData.activity_level);
    
    case 4:
      // Dietary preferences - always valid as it's optional
      return true;
    
    default:
      return false;
  }
};
