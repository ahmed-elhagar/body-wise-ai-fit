
export const calculateDailyCalories = (userProfile: any): number => {
  const { age, weight, height, gender, activity_level, fitness_goal } = userProfile;
  
  // Harris-Benedict equation for BMR
  let bmr: number;
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
  
  // Activity multipliers
  const activityMultipliers: { [key: string]: number } = {
    'sedentary': 1.2,
    'lightly_active': 1.375,
    'moderately_active': 1.55,
    'very_active': 1.725,
    'extremely_active': 1.9
  };
  
  const activityMultiplier = activityMultipliers[activity_level] || 1.55;
  let tdee = bmr * activityMultiplier;
  
  // Adjust for fitness goals
  if (fitness_goal === 'weight_loss') {
    tdee *= 0.85; // 15% deficit
  } else if (fitness_goal === 'weight_gain' || fitness_goal === 'muscle_gain') {
    tdee *= 1.1; // 10% surplus
  }
  
  return Math.round(tdee);
};

export const calculateLifePhaseAdjustments = (userProfile: any): number => {
  let adjustments = 0;
  
  // Pregnancy adjustments
  if (userProfile.pregnancy_trimester === 2) {
    adjustments += 340;
  } else if (userProfile.pregnancy_trimester === 3) {
    adjustments += 450;
  }
  
  // Breastfeeding adjustments
  if (userProfile.breastfeeding_level === 'exclusive') {
    adjustments += 400;
  } else if (userProfile.breastfeeding_level === 'partial') {
    adjustments += 250;
  }
  
  return adjustments;
};
