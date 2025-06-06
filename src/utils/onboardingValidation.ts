
import { OnboardingFormData } from '@/hooks/useOnboardingForm';

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      return !!(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.age?.trim() &&
        formData.gender?.trim() &&
        formData.height?.trim() &&
        formData.weight?.trim()
      );
    
    case 2:
      return !!(
        formData.body_fat_percentage?.trim() &&
        formData.preferred_foods?.length > 0
      );
    
    case 3:
      return !!(
        formData.fitness_goal?.trim() &&
        formData.activity_level?.trim()
      );
    
    case 4:
      // Step 4 is optional for allergies and dietary restrictions
      return true;
    
    default:
      return false;
  }
};
