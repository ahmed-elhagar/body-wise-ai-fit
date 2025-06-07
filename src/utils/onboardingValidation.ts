
import { OnboardingFormData } from "@/hooks/useOnboardingForm";
import { VALID_ACTIVITY_LEVELS } from "@/hooks/profile/types";

// Valid body shape values that match database constraint
const VALID_BODY_SHAPES = ['lean', 'athletic', 'curvy', 'bulky'] as const;
export type BodyShape = typeof VALID_BODY_SHAPES[number];

export const validateOnboardingStep = (step: number, formData: OnboardingFormData): boolean => {
  console.log(`Validating step ${step} with form data:`, formData);
  
  switch (step) {
    case 1:
      // Basic Information - all fields required except nationality
      const step1Valid = !!(
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
      console.log(`Step 1 validation result: ${step1Valid}`);
      return step1Valid;
    
    case 2:
      // Body composition - body fat percentage required and valid
      const bodyFatValue = parseFloat(formData.body_fat_percentage);
      const isValidRange = formData.gender === 'male' 
        ? (bodyFatValue >= 8 && bodyFatValue <= 35)
        : (bodyFatValue >= 15 && bodyFatValue <= 45);
      
      const step2Valid = !!(formData.body_fat_percentage && bodyFatValue > 0 && isValidRange);
      console.log(`Step 2 validation result: ${step2Valid}, body fat: ${bodyFatValue}`);
      return step2Valid;
    
    case 3:
      // Goals and activity - fitness goal and activity level required
      const validFitnessGoals = ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'general_fitness', 'lose_weight', 'gain_muscle', 'maintain'];
      
      const step3Valid = !!(
        formData.fitness_goal && 
        validFitnessGoals.includes(formData.fitness_goal) &&
        formData.activity_level && 
        VALID_ACTIVITY_LEVELS.includes(formData.activity_level as any)
      );
      console.log(`Step 3 validation result: ${step3Valid}`);
      console.log(`- fitness goal: ${formData.fitness_goal} (valid: ${validFitnessGoals.includes(formData.fitness_goal)})`);
      console.log(`- activity level: ${formData.activity_level} (valid: ${VALID_ACTIVITY_LEVELS.includes(formData.activity_level as any)})`);
      return step3Valid;
    
    case 4:
      // Summary - validate all previous steps are complete
      const allStepsValid = validateOnboardingStep(1, formData) && 
                           validateOnboardingStep(2, formData) && 
                           validateOnboardingStep(3, formData);
      console.log(`Step 4 (summary) validation result: ${allStepsValid}`);
      return allStepsValid;
    
    default:
      return false;
  }
};

// Helper function to map body fat percentage to valid body shape
export const mapBodyFatToBodyShape = (bodyFatPercentage: number, gender: string): BodyShape => {
  if (gender === 'male') {
    if (bodyFatPercentage < 15) return 'lean';
    if (bodyFatPercentage < 25) return 'athletic';
    return 'bulky';
  } else {
    if (bodyFatPercentage < 20) return 'lean';
    if (bodyFatPercentage < 30) return 'athletic';
    return 'curvy';
  }
};
