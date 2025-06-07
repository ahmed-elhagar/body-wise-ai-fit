
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      // Basic Information - all fields required except nationality
      return !!(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.age &&
        parseFloat(formData.age) >= 13 &&
        parseFloat(formData.age) <= 100 &&
        formData.gender &&
        formData.height &&
        parseFloat(formData.height) >= 100 &&
        parseFloat(formData.height) <= 250 &&
        formData.weight &&
        parseFloat(formData.weight) >= 30 &&
        parseFloat(formData.weight) <= 300
      );
    
    case 2:
      // Body composition - body fat percentage required and valid
      const bodyFatValue = parseFloat(formData.body_fat_percentage);
      const isValidRange = formData.gender === 'male' 
        ? (bodyFatValue >= 8 && bodyFatValue <= 35)
        : (bodyFatValue >= 15 && bodyFatValue <= 45);
      
      return !!(formData.body_fat_percentage && bodyFatValue > 0 && isValidRange);
    
    case 3:
      // Goals and activity - fitness goal and activity level required
      // Validate that activity_level matches database constraint values
      const validActivityLevels = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'];
      return !!(
        formData.fitness_goal && 
        formData.activity_level && 
        validActivityLevels.includes(formData.activity_level)
      );
    
    case 4:
      // Summary - always valid as it's a review step
      return true;
    
    default:
      return false;
  }
};
