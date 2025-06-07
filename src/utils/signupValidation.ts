
// Valid body shape values that match database constraint
const VALID_BODY_SHAPES = ['lean', 'athletic', 'average', 'heavy'] as const;
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
      // Physical info - age, gender, height, weight required
      const step2Valid = !!(
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
      console.log(`Step 2 validation result: ${step2Valid}`);
      return step2Valid;
    
    case 3:
      // Body composition - body fat percentage required and valid
      const bodyFatValue = parseFloat(formData.bodyFatPercentage);
      const isValidRange = formData.gender === 'male' 
        ? (bodyFatValue >= 8 && bodyFatValue <= 35)
        : (bodyFatValue >= 15 && bodyFatValue <= 45);
      
      const step3Valid = !!(formData.bodyFatPercentage && bodyFatValue > 0 && isValidRange);
      console.log(`Step 3 validation result: ${step3Valid}, body fat: ${bodyFatValue}`);
      return step3Valid;
    
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
      return true;
    
    default:
      return false;
  }
};

// Helper function to map body fat percentage to valid body shape
export const mapBodyFatToBodyShape = (bodyFatPercentage: number, gender: string): BodyShape => {
  console.log(`🔍 Mapping body fat: ${bodyFatPercentage}% for ${gender}`);
  
  let result: BodyShape;
  
  if (gender === 'male') {
    if (bodyFatPercentage <= 15) {
      result = 'lean';
    } else if (bodyFatPercentage <= 25) {
      result = 'athletic';
    } else if (bodyFatPercentage <= 35) {
      result = 'average';
    } else {
      result = 'heavy';
    }
  } else {
    if (bodyFatPercentage <= 20) {
      result = 'lean';
    } else if (bodyFatPercentage <= 30) {
      result = 'athletic';
    } else if (bodyFatPercentage <= 40) {
      result = 'average';
    } else {
      result = 'heavy';
    }
  }
  
  console.log(`✅ Body shape mapped to: "${result}"`);
  
  if (!VALID_BODY_SHAPES.includes(result)) {
    console.error(`❌ Invalid body shape result: "${result}". Falling back to 'average'`);
    return 'average';
  }
  
  return result;
};

// Helper function to validate body shape value
export const isValidBodyShape = (bodyShape: string): bodyShape is BodyShape => {
  const isValid = VALID_BODY_SHAPES.includes(bodyShape as BodyShape);
  console.log(`🔍 Validating body shape: "${bodyShape}" -> ${isValid}`);
  return isValid;
};
