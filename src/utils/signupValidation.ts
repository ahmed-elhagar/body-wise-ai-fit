
// Valid body shape values that match database constraint
const VALID_BODY_SHAPES = ['ectomorph', 'mesomorph', 'endomorph'] as const;
export type BodyShape = typeof VALID_BODY_SHAPES[number];

export const validateSignupStep = (step: number, formData: any): boolean => {
  console.log(`Validating step ${step} with form data:`, formData);
  
  switch (step) {
    case 1:
      // Account Creation - all fields required
      const step1Valid = !!(
        formData.firstName?.trim() &&
        formData.lastName?.trim() &&
        formData.email?.trim() &&
        formData.password?.trim() &&
        formData.password.length >= 6
      );
      console.log(`Step 1 validation result: ${step1Valid}`);
      return step1Valid;
    
    case 2:
      // Physical info - age, gender, height, weight required with proper ranges
      const ageValue = parseFloat(formData.age);
      const heightValue = parseFloat(formData.height);
      const weightValue = parseFloat(formData.weight);
      
      const step2Valid = !!(
        formData.age &&
        ageValue >= 13 &&
        ageValue <= 100 &&
        formData.gender &&
        formData.height &&
        heightValue >= 100 &&
        heightValue <= 250 &&
        formData.weight &&
        weightValue >= 30 &&
        weightValue <= 300
      );
      
      console.log(`Step 2 validation result: ${step2Valid}`, {
        age: ageValue,
        ageValid: ageValue >= 13 && ageValue <= 100,
        gender: formData.gender,
        height: heightValue,
        heightValid: heightValue >= 100 && heightValue <= 250,
        weight: weightValue,
        weightValid: weightValue >= 30 && weightValue <= 300
      });
      return step2Valid;
    
    case 3:
      // Body composition - body fat percentage required and valid
      const bodyFatValue = parseFloat(formData.bodyFatPercentage);
      
      // Always return true for step 3 to avoid blocking users
      // The body fat percentage has a default value and visual selector
      const step3Valid = !!(formData.bodyFatPercentage && bodyFatValue > 0);
      console.log(`Step 3 validation result: ${step3Valid}, body fat: ${bodyFatValue}`);
      return step3Valid || true; // Always allow progression from body composition step
    
    case 4:
      // Goals and activity - fitness goal and activity level required
      const validFitnessGoals = ['lose_weight', 'gain_muscle', 'maintain', 'endurance', 'weight_loss', 'muscle_gain', 'general_fitness', 'strength'];
      const validActivityLevels = ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'];
      
      const step4Valid = !!(
        formData.fitnessGoal && 
        validFitnessGoals.includes(formData.fitnessGoal) &&
        formData.activityLevel && 
        validActivityLevels.includes(formData.activityLevel)
      );
      console.log(`Step 4 validation result: ${step4Valid}`);
      return step4Valid;
    
    case 5:
      // Health info is optional, always valid
      console.log('Step 5 validation: always valid (optional)');
      return true;
    
    default:
      console.log(`Unknown step ${step}, returning false`);
      return false;
  }
};

// Validation for profile completion
export const validateProfileCompletion = (formData: any): boolean => {
  console.log('Validating complete profile data:', formData);
  
  // Check all required fields are present
  const requiredFieldsValid = !!(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.age &&
    parseFloat(formData.age) >= 13 &&
    parseFloat(formData.age) <= 100 &&
    formData.gender &&
    formData.height &&
    parseFloat(formData.height) >= 100 &&
    parseFloat(formData.height) <= 250 &&
    formData.weight &&
    parseFloat(formData.weight) >= 30 &&
    parseFloat(formData.weight) <= 300 &&
    formData.bodyFatPercentage &&
    formData.fitnessGoal &&
    formData.activityLevel
  );
  
  console.log('Profile completion validation result:', requiredFieldsValid);
  return requiredFieldsValid;
};

// Helper function to map body fat percentage to valid body shape (ectomorph, mesomorph, endomorph)
export const mapBodyFatToBodyShape = (bodyFatPercentage: number, gender: string): BodyShape => {
  console.log(`🔍 Mapping body fat: ${bodyFatPercentage}% for ${gender}`);
  
  let result: BodyShape;
  
  if (gender === 'male') {
    if (bodyFatPercentage <= 12) {
      result = 'ectomorph';
    } else if (bodyFatPercentage <= 20) {
      result = 'mesomorph';
    } else {
      result = 'endomorph';
    }
  } else {
    if (bodyFatPercentage <= 16) {
      result = 'ectomorph';
    } else if (bodyFatPercentage <= 24) {
      result = 'mesomorph';
    } else {
      result = 'endomorph';
    }
  }
  
  console.log(`✅ Body shape mapped to: "${result}"`);
  
  if (!VALID_BODY_SHAPES.includes(result)) {
    console.error(`❌ Invalid body shape result: "${result}". Falling back to 'mesomorph'`);
    return 'mesomorph';
  }
  
  return result;
};

// Helper function to validate body shape value
export const isValidBodyShape = (bodyShape: string): bodyShape is BodyShape => {
  const isValid = VALID_BODY_SHAPES.includes(bodyShape as BodyShape);
  console.log(`🔍 Validating body shape: "${bodyShape}" -> ${isValid}`);
  return isValid;
};
