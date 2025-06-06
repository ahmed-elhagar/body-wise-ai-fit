
import { UnifiedFormData } from "@/hooks/useUnifiedForm";

export const validateUnifiedStep = (step: number, formData: UnifiedFormData): boolean => {
  switch (step) {
    case 1:
      // Account Creation - All fields required
      return !!(
        formData.email?.trim() &&
        formData.password?.trim() &&
        formData.first_name?.trim() &&
        formData.last_name?.trim()
      );
    
    case 2:
      // Basic Physical Info - All required
      return !!(
        formData.age &&
        formData.gender &&
        formData.height &&
        formData.weight
      );
    
    case 3:
      // Body Composition - body shape and fat percentage required
      return !!(
        formData.body_shape &&
        formData.body_fat_percentage
      );
    
    case 4:
      // Goals & Activity - both required
      return !!(
        formData.fitness_goal &&
        formData.activity_level
      );
    
    case 5:
      // Health & Dietary - optional
      return true;
    
    case 6:
      // Special Conditions - optional
      return true;
    
    default:
      return false;
  }
};
