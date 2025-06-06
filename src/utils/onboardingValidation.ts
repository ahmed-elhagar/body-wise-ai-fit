
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      // Basic Personal Info - Name and Age required
      return !!(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.age
      );
    
    case 2:
      // Physical Stats - Gender, Height, Weight required
      return !!(
        formData.gender &&
        formData.height &&
        formData.weight
      );
    
    case 3:
      // Body Composition - body fat percentage is set by the slider
      return !!(formData.body_fat_percentage);
    
    case 4:
      // Fitness Goals - required
      return !!(formData.fitness_goal);
    
    case 5:
      // Activity Level - required
      return !!(formData.activity_level);
    
    case 6:
      // Health Conditions - always valid (optional)
      return true;
    
    case 7:
      // Special Conditions - always valid (optional, only for females)
      return true;
    
    case 8:
      // Dietary Preferences - always valid (optional)
      return true;
    
    default:
      return false;
  }
};
