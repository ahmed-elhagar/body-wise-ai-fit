
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { VALID_ACTIVITY_LEVELS } from "@/hooks/profile/types";

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
      // Use the exact VALID_ACTIVITY_LEVELS from types
      const validFitnessGoals = ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'general_fitness'];
      
      return !!(
        formData.fitness_goal && 
        validFitnessGoals.includes(formData.fitness_goal) &&
        formData.activity_level && 
        VALID_ACTIVITY_LEVELS.includes(formData.activity_level as any)
      );
    
    case 4:
      // Summary - always valid as it's a review step
      return true;
    
    default:
      return false;
  }
};
