
import { OnboardingFormData } from "@/hooks/useOnboardingForm";

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  switch (step) {
    case 1:
      return !!(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.age &&
        parseInt(formData.age) >= 13 &&
        parseInt(formData.age) <= 100
      );
    
    case 2:
      return !!(
        formData.gender &&
        formData.height &&
        parseFloat(formData.height) >= 100 &&
        parseFloat(formData.height) <= 250 &&
        formData.weight &&
        parseFloat(formData.weight) >= 30 &&
        parseFloat(formData.weight) <= 300
      );
    
    case 3:
      return !!(
        formData.body_fat_percentage &&
        parseFloat(formData.body_fat_percentage.toString()) >= 5 &&
        parseFloat(formData.body_fat_percentage.toString()) <= 50
      );
    
    case 4:
      return !!(formData.fitness_goal);
    
    case 5:
      return !!(formData.activity_level);
    
    case 6:
    case 7:
    case 8:
      // These steps are optional
      return true;
    
    default:
      return false;
  }
};

export const getStepRequiredFields = (step: number): string[] => {
  switch (step) {
    case 1:
      return ['first_name', 'last_name', 'age'];
    case 2:
      return ['gender', 'height', 'weight'];
    case 3:
      return ['body_fat_percentage'];
    case 4:
      return ['fitness_goal'];
    case 5:
      return ['activity_level'];
    default:
      return [];
  }
};

export const validateAllSteps = (formData: OnboardingFormData): { isValid: boolean; invalidSteps: number[] } => {
  const invalidSteps: number[] = [];
  
  for (let step = 1; step <= 5; step++) {
    if (!validateOnboardingStep(step, formData)) {
      invalidSteps.push(step);
    }
  }
  
  return {
    isValid: invalidSteps.length === 0,
    invalidSteps
  };
};
